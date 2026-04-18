import { useDeferredValue, useEffect, useMemo, useState } from "react";
import {
  Download,
  Loader2,
  LogOut,
  RefreshCw,
  Search,
  ShieldCheck,
  Users,
} from "lucide-react";
import { toast } from "sonner";
import type { AdminRsvpItem, AdminRsvpsResponse } from "@shared/schemas";
import { attendanceLabels, type AttendanceStatus } from "@shared/constants";
import { ApiError, adminLogin, adminLogout, fetchAdminRsvps, updateAdminRsvp } from "@/lib/api";
import { formatDisplayDateTime } from "@/lib/format";

type DraftMap = Record<
  string,
  {
    attendance_status: AttendanceStatus;
    admin_notes: string;
  }
>;

const statusOptions: AttendanceStatus[] = ["pending", "attending", "not-attending"];

function SummaryCard({
  label,
  value,
  caption,
}: {
  label: string;
  value: number;
  caption: string;
}) {
  return (
    <div className="card-luxe px-5 py-5">
      <p className="text-[0.68rem] uppercase tracking-[0.28em] text-[color:var(--color-gold-soft)]/72">
        {label}
      </p>
      <p className="mt-3 text-4xl text-[color:var(--color-paper)]">{value}</p>
      <p className="mt-2 text-sm text-white/56">{caption}</p>
    </div>
  );
}

function buildDrafts(items: AdminRsvpItem[]): DraftMap {
  return Object.fromEntries(
    items.map((item) => [
      item.id,
      {
        attendance_status: item.attendance_status,
        admin_notes: item.admin_notes,
      },
    ]),
  );
}

export default function AdminPage() {
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submittingLogin, setSubmittingLogin] = useState(false);
  const [password, setPassword] = useState("");
  const [data, setData] = useState<AdminRsvpsResponse | null>(null);
  const [drafts, setDrafts] = useState<DraftMap>({});
  const [searchTerm, setSearchTerm] = useState("");
  const deferredSearch = useDeferredValue(searchTerm);
  const [statusFilter, setStatusFilter] = useState<AttendanceStatus | "all">("all");
  const [savingId, setSavingId] = useState<string | null>(null);

  async function loadData(showToast = false) {
    try {
      setLoading(true);
      const response = await fetchAdminRsvps();
      setAuthenticated(true);
      setData(response);
      setDrafts(buildDrafts(response.items));
      if (showToast) {
        toast.success("Painel atualizado.");
      }
    } catch (error) {
      if (error instanceof ApiError && (error.status === 401 || error.status === 503)) {
        setAuthenticated(false);
        setData(null);
      } else {
        toast.error(
          error instanceof Error
            ? error.message
            : "Não foi possível carregar as confirmações.",
        );
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      void loadData();
    }, 0);

    return () => window.clearTimeout(timeout);
  }, []);

  const filteredItems = useMemo(() => {
    if (!data) {
      return [];
    }

    const term = deferredSearch.trim().toLowerCase();

    return data.items.filter((item) => {
      const matchesStatus =
        statusFilter === "all" ? true : item.attendance_status === statusFilter;
      const matchesSearch =
        term.length === 0
          ? true
          : item.guest_name.toLowerCase().includes(term) || item.phone.includes(term);

      return matchesStatus && matchesSearch;
    });
  }, [data, deferredSearch, statusFilter]);

  async function handleLogin(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      setSubmittingLogin(true);
      await adminLogin(password);
      setPassword("");
      toast.success("Acesso administrativo liberado.");
      await loadData();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Senha inválida.");
    } finally {
      setSubmittingLogin(false);
    }
  }

  async function handleLogout() {
    try {
      await adminLogout();
    } finally {
      setAuthenticated(false);
      setData(null);
      toast.success("Sessão encerrada.");
    }
  }

  async function handleSave(item: AdminRsvpItem) {
    const draft = drafts[item.id];

    if (!draft) {
      return;
    }

    try {
      setSavingId(item.id);
      await updateAdminRsvp(item.id, draft);
      toast.success("Registro atualizado.");
      await loadData();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Não foi possível salvar as alterações.",
      );
    } finally {
      setSavingId(null);
    }
  }

  if (loading && !data && authenticated === false) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="size-7 animate-spin text-[color:var(--color-gold-soft)]" />
      </div>
    );
  }

  if (!authenticated) {
    return (
      <div className="container-shell flex min-h-screen items-center justify-center py-16">
        <div className="panel-luxe w-full max-w-md px-6 py-8 sm:px-8">
          <div className="mx-auto flex size-16 items-center justify-center rounded-full border border-[color:var(--color-gold)]/30 bg-[color:var(--color-gold)]/10">
            <ShieldCheck className="size-7 text-[color:var(--color-gold-soft)]" />
          </div>
          <p className="section-label mt-8 justify-center">Área administrativa</p>
          <h1 className="mt-5 text-center text-4xl text-[color:var(--color-paper)]">
            Acesso restrito
          </h1>
          <p className="mt-4 text-center text-base leading-7 text-white/66">
            Digite a senha administrativa para visualizar, filtrar e editar as
            confirmações de presença.
          </p>

          <form className="mt-8 space-y-5" onSubmit={handleLogin}>
            <div>
              <label className="mb-2 block text-[0.7rem] uppercase tracking-[0.25em] text-white/58">
                Senha administrativa
              </label>
              <input
                className="w-full rounded-[22px] border border-white/10 bg-black/12 px-4 py-4 text-base outline-none transition placeholder:text-white/24 focus:border-[color:var(--color-gold)]/45"
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Digite a senha"
                type="password"
                value={password}
              />
            </div>

            <button className="button-primary flex w-full" disabled={submittingLogin} type="submit">
              {submittingLogin ? (
                <>
                  <Loader2 className="mr-2 size-4 animate-spin" />
                  Entrando
                </>
              ) : (
                "Entrar"
              )}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="container-shell py-10 sm:py-12">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="section-label">Admin / Camilla</p>
          <h1 className="mt-5 text-4xl text-[color:var(--color-paper)] sm:text-5xl">
            Confirmações de presença
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-8 text-white/66">
            Painel seguro para acompanhar respostas, atualizar status, registrar observações
            e exportar a lista completa.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <button className="button-secondary" onClick={() => void loadData(true)} type="button">
            <RefreshCw className="mr-2 size-4" />
            Atualizar
          </button>
          <a className="button-secondary" href="/api/admin/export/csv" target="_blank" rel="noreferrer">
            <Download className="mr-2 size-4" />
            Exportar CSV
          </a>
          <button className="button-ghost" onClick={() => void handleLogout()} type="button">
            <LogOut className="mr-2 size-4" />
            Sair
          </button>
        </div>
      </div>

      <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <SummaryCard label="Respostas" value={data?.summary.total ?? 0} caption="Formulários enviados" />
        <SummaryCard label="Confirmados" value={data?.summary.attending ?? 0} caption="Pessoas que irão" />
        <SummaryCard label="Ausências" value={data?.summary.notAttending ?? 0} caption="Não comparecerão" />
        <SummaryCard label="Total de pessoas" value={data?.summary.totalPeople ?? 0} caption="Incluindo acompanhantes" />
      </div>

      <div className="panel-luxe mt-8 px-5 py-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-white/35" />
            <input
              className="w-full rounded-[22px] border border-white/10 bg-black/12 px-11 py-4 text-base outline-none transition placeholder:text-white/24 focus:border-[color:var(--color-gold)]/45"
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Buscar por nome ou telefone"
              value={searchTerm}
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {(["all", ...statusOptions] as const).map((status) => (
              <button
                key={status}
                className={`rounded-full border px-4 py-2 text-xs uppercase tracking-[0.22em] transition ${
                  statusFilter === status
                    ? "border-[color:var(--color-gold)]/55 bg-[color:var(--color-gold)]/16 text-[color:var(--color-paper)]"
                    : "border-white/10 bg-white/[0.04] text-white/55"
                }`}
                onClick={() => setStatusFilter(status)}
                type="button"
              >
                {status === "all" ? "Todos" : attendanceLabels[status]}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-8 space-y-4 lg:hidden">
        {filteredItems.map((item) => (
          <article key={item.id} className="panel-luxe px-5 py-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-lg text-[color:var(--color-paper)]">{item.guest_name}</p>
                <p className="mt-1 text-sm text-white/52">{item.phone}</p>
              </div>
              <span className="rounded-full border border-[color:var(--color-gold)]/20 bg-[color:var(--color-gold)]/8 px-3 py-1 text-[0.68rem] uppercase tracking-[0.22em] text-[color:var(--color-gold-soft)]/78">
                {attendanceLabels[item.attendance_status]}
              </span>
            </div>

            <div className="mt-5 grid gap-3">
              <div className="rounded-[20px] border border-white/10 bg-black/12 px-4 py-4">
                <p className="text-[0.68rem] uppercase tracking-[0.22em] text-white/48">
                  Acompanhantes
                </p>
                <p className="mt-2 text-sm text-white/72">
                  {item.companions_count > 0
                    ? item.companions_names.join(", ")
                    : "Sem acompanhantes"}
                </p>
              </div>
              <div className="rounded-[20px] border border-white/10 bg-black/12 px-4 py-4">
                <p className="text-[0.68rem] uppercase tracking-[0.22em] text-white/48">
                  Observações do convidado
                </p>
                <p className="mt-2 text-sm leading-7 text-white/72">
                  {item.notes || "Sem observações."}
                </p>
              </div>
            </div>

            <div className="mt-5 grid gap-4">
              <select
                className="w-full rounded-[18px] border border-white/10 bg-black/12 px-4 py-3 text-sm"
                onChange={(event) =>
                  setDrafts((current) => ({
                    ...current,
                    [item.id]: {
                      ...current[item.id],
                      attendance_status: event.target.value as AttendanceStatus,
                    },
                  }))
                }
                value={drafts[item.id]?.attendance_status ?? item.attendance_status}
              >
                {statusOptions.map((status) => (
                  <option key={status} value={status}>
                    {attendanceLabels[status]}
                  </option>
                ))}
              </select>
              <textarea
                className="min-h-28 w-full rounded-[18px] border border-white/10 bg-black/12 px-4 py-3 text-sm"
                onChange={(event) =>
                  setDrafts((current) => ({
                    ...current,
                    [item.id]: {
                      ...current[item.id],
                      admin_notes: event.target.value,
                    },
                  }))
                }
                placeholder="Observações do admin"
                value={drafts[item.id]?.admin_notes ?? ""}
              />
              <button className="button-primary flex w-full" onClick={() => void handleSave(item)} type="button">
                {savingId === item.id ? (
                  <>
                    <Loader2 className="mr-2 size-4 animate-spin" />
                    Salvando
                  </>
                ) : (
                  "Salvar alterações"
                )}
              </button>
            </div>

            <p className="mt-4 text-xs uppercase tracking-[0.18em] text-white/38">
              Enviado em {formatDisplayDateTime(item.created_at)}
            </p>
          </article>
        ))}
      </div>

      <div className="panel-luxe mt-8 hidden overflow-hidden lg:block">
        <div className="overflow-x-auto">
          <table className="min-w-full table-fixed">
            <thead className="bg-white/[0.04] text-left">
              <tr className="text-[0.68rem] uppercase tracking-[0.24em] text-white/52">
                <th className="px-5 py-4 font-medium">Convidado</th>
                <th className="px-5 py-4 font-medium">Presença</th>
                <th className="px-5 py-4 font-medium">Acompanhantes</th>
                <th className="px-5 py-4 font-medium">Observações</th>
                <th className="px-5 py-4 font-medium">Admin</th>
                <th className="px-5 py-4 font-medium">Envio</th>
                <th className="px-5 py-4 font-medium">Ação</th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.map((item) => (
                <tr key={item.id} className="border-t border-white/8 align-top">
                  <td className="px-5 py-5">
                    <p className="text-lg text-[color:var(--color-paper)]">{item.guest_name}</p>
                    <p className="mt-1 text-sm text-white/52">{item.phone}</p>
                  </td>
                  <td className="px-5 py-5">
                    <select
                      className="w-full rounded-[18px] border border-white/10 bg-black/12 px-4 py-3 text-sm"
                      onChange={(event) =>
                        setDrafts((current) => ({
                          ...current,
                          [item.id]: {
                            ...current[item.id],
                            attendance_status: event.target.value as AttendanceStatus,
                          },
                        }))
                      }
                      value={drafts[item.id]?.attendance_status ?? item.attendance_status}
                    >
                      {statusOptions.map((status) => (
                        <option key={status} value={status}>
                          {attendanceLabels[status]}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="px-5 py-5 text-sm leading-7 text-white/72">
                    {item.companions_count > 0
                      ? item.companions_names.join(", ")
                      : "Sem acompanhantes"}
                  </td>
                  <td className="px-5 py-5 text-sm leading-7 text-white/72">
                    {item.notes || "Sem observações."}
                  </td>
                  <td className="px-5 py-5">
                    <textarea
                      className="min-h-28 w-full rounded-[18px] border border-white/10 bg-black/12 px-4 py-3 text-sm"
                      onChange={(event) =>
                        setDrafts((current) => ({
                          ...current,
                          [item.id]: {
                            ...current[item.id],
                            admin_notes: event.target.value,
                          },
                        }))
                      }
                      placeholder="Observações do admin"
                      value={drafts[item.id]?.admin_notes ?? ""}
                    />
                  </td>
                  <td className="px-5 py-5 text-sm text-white/58">
                    {formatDisplayDateTime(item.created_at)}
                  </td>
                  <td className="px-5 py-5">
                    <button className="button-primary min-h-11 px-4 py-2 text-[0.68rem]" onClick={() => void handleSave(item)} type="button">
                      {savingId === item.id ? (
                        <>
                          <Loader2 className="mr-2 size-4 animate-spin" />
                          Salvando
                        </>
                      ) : (
                        "Salvar"
                      )}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {filteredItems.length === 0 ? (
        <div className="panel-luxe mt-8 flex flex-col items-center justify-center gap-4 px-6 py-14 text-center">
          <Users className="size-9 text-[color:var(--color-gold-soft)]/62" />
          <p className="text-lg text-[color:var(--color-paper)]">
            Nenhuma confirmação encontrada para este filtro.
          </p>
          <p className="max-w-md text-sm leading-7 text-white/58">
            Ajuste os filtros ou atualize o painel para carregar novas respostas.
          </p>
        </div>
      ) : null}
    </div>
  );
}
