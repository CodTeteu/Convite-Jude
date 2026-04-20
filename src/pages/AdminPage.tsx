import { useDeferredValue, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Calendar,
  Download,
  GraduationCap,
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

// ===========================================
// TYPES & CONSTANTS
// ===========================================

type DraftMap = Record<
  string,
  {
    attendance_status: AttendanceStatus;
    admin_notes: string;
  }
>;

const statusOptions: AttendanceStatus[] = ["pending", "attending", "not-attending"];

const badgeClassMap: Record<AttendanceStatus, string> = {
  attending: "admin-badge admin-badge-attending",
  "not-attending": "admin-badge admin-badge-not-attending",
  pending: "admin-badge admin-badge-pending",
};

function buildDrafts(items: AdminRsvpItem[] | undefined): DraftMap {
  return Object.fromEntries(
    (items ?? []).map((item) => [
      item.id,
      {
        attendance_status: item.attendance_status,
        admin_notes: item.admin_notes,
      },
    ]),
  );
}

// ===========================================
// LOGIN FORM COMPONENT
// ===========================================

function LoginScreen({
  onLogin,
}: {
  onLogin: (password: string) => Promise<void>;
}) {
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    try {
      setSubmitting(true);
      await onLogin(password);
      setPassword("");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center px-5 py-16">
      {/* Decorative background */}
      <div className="admin-login-bg" />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="invite-card-strong relative z-10 w-full max-w-md px-6 py-10 sm:px-10"
      >
        {/* Icon */}
        <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-[var(--invite-sage-soft)] text-[var(--invite-brown)]">
          <ShieldCheck className="size-7" />
        </div>

        {/* Title */}
        <p className="mt-6 text-center font-heading text-[0.72rem] uppercase tracking-[0.32em] text-[var(--invite-sage)]">
          Área administrativa
        </p>
        <h1 className="mt-4 text-center font-heading text-4xl text-[var(--invite-brown)]">
          Acesso restrito
        </h1>
        <p className="mt-4 text-center font-body text-lg leading-relaxed text-[var(--invite-brown-soft)]">
          Digite a senha administrativa para gerenciar as confirmações de presença.
        </p>

        {/* Form */}
        <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
          <div>
            <label className="mb-2 block text-sm font-medium text-[var(--invite-brown-soft)]">
              Senha administrativa
            </label>
            <div className="relative">
              <input
                className="w-full rounded-[16px] border border-[var(--invite-line)] bg-transparent py-4 pl-11 pr-5 text-lg text-[var(--invite-brown)] outline-none transition placeholder:text-[var(--invite-brown-soft)]/40 focus:border-[var(--invite-gold)] focus:bg-[var(--invite-paper)]"
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                type="password"
                value={password}
                disabled={submitting}
              />
              <ShieldCheck className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-[var(--invite-brown-soft)]/40" />
            </div>
          </div>

          <button
            className="invite-button-primary flex w-full"
            disabled={submitting}
            type="submit"
          >
            {submitting ? (
              <>
                <Loader2 className="mr-2 size-4 animate-spin" />
                Entrando...
              </>
            ) : (
              "Entrar no Painel"
            )}
          </button>
        </form>

        {/* Back link */}
        <div className="mt-8 flex justify-center">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm text-[var(--invite-brown-soft)] transition hover:text-[var(--invite-brown)]"
          >
            <ArrowLeft className="size-4" />
            Voltar para o convite
          </Link>
        </div>
      </motion.div>
    </div>
  );
}

// ===========================================
// STATS CARD COMPONENT
// ===========================================

interface StatsCardProps {
  title: string;
  value: number;
  caption: string;
  icon: React.ReactNode;
  delay?: number;
}

function StatsCard({ title, value, caption, icon, delay = 0 }: StatsCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
    >
      <div className="admin-stat-card group">
        {/* Background icon */}
        <div className="absolute -right-2 -top-2 text-[var(--invite-sage-soft)] opacity-20 transition-opacity group-hover:opacity-30">
          {icon}
        </div>

        <p className="relative z-10 text-[0.68rem] uppercase tracking-[0.28em] text-[var(--invite-sage)]">
          {title}
        </p>
        <p className="relative z-10 mt-3 font-heading text-4xl text-[var(--invite-brown)]">
          {value}
        </p>
        <p className="relative z-10 mt-2 text-sm text-[var(--invite-brown-soft)]">
          {caption}
        </p>
      </div>
    </motion.div>
  );
}

// ===========================================
// SUBMISSIONS TABLE (DESKTOP)
// ===========================================

interface TableProps {
  items: AdminRsvpItem[];
  drafts: DraftMap;
  setDrafts: React.Dispatch<React.SetStateAction<DraftMap>>;
  savingId: string | null;
  onSave: (item: AdminRsvpItem) => void;
}

function DesktopTable({ items, drafts, setDrafts, savingId, onSave }: TableProps) {
  return (
    <div className="invite-card mt-8 hidden overflow-hidden lg:block">
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr className="admin-table-header">
              <th className="px-5 py-4 font-medium">Convidado</th>
              <th className="px-5 py-4 font-medium">Presença</th>
              <th className="px-5 py-4 font-medium text-center">Pessoas</th>
              <th className="px-5 py-4 font-medium">Observações</th>
              <th className="px-5 py-4 font-medium">Admin</th>
              <th className="px-5 py-4 font-medium">Envio</th>
              <th className="px-5 py-4 font-medium">Ação</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, index) => (
              <motion.tr
                key={item.id}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.03 }}
                className="admin-table-row align-top"
              >
                {/* Guest name + phone */}
                <td className="px-5 py-5">
                  <div className="flex items-center gap-3">
                    <div className="admin-avatar flex-shrink-0">
                      {item.guest_name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-heading text-base font-semibold text-[var(--invite-brown)]">
                        {item.guest_name}
                      </p>
                      <p className="mt-0.5 text-xs text-[var(--invite-brown-soft)]">
                        {item.phone}
                      </p>
                    </div>
                  </div>
                </td>

                {/* Attendance status select */}
                <td className="px-5 py-5">
                  <select
                    className="w-full rounded-[14px] border border-[var(--invite-line)] bg-transparent px-3 py-2.5 text-sm text-[var(--invite-brown)] outline-none transition focus:border-[var(--invite-gold)]"
                    onChange={(e) =>
                      setDrafts((cur) => ({
                        ...cur,
                        [item.id]: {
                          ...cur[item.id],
                          attendance_status: e.target.value as AttendanceStatus,
                        },
                      }))
                    }
                    value={drafts[item.id]?.attendance_status ?? item.attendance_status}
                  >
                    {statusOptions.map((s) => (
                      <option key={s} value={s}>
                        {attendanceLabels[s]}
                      </option>
                    ))}
                  </select>
                  <div className="mt-2">
                    <span className={badgeClassMap[drafts[item.id]?.attendance_status ?? item.attendance_status]}>
                      {attendanceLabels[drafts[item.id]?.attendance_status ?? item.attendance_status]}
                    </span>
                  </div>
                </td>

                {/* Companions */}
                <td className="px-5 py-5 text-center">
                  <span className="inline-flex items-center rounded-full border border-[var(--invite-line)] bg-[var(--invite-sage-soft)]/30 px-3 py-1 text-sm font-medium text-[var(--invite-brown)]">
                    {item.companions_count + 1}
                  </span>
                  {item.companions_count > 0 && (
                    <p className="mt-2 max-w-[180px] text-xs leading-relaxed text-[var(--invite-brown-soft)]">
                      {item.companions_names.join(", ")}
                    </p>
                  )}
                </td>

                {/* Guest notes */}
                <td className="px-5 py-5">
                  {item.notes ? (
                    <div className="admin-message-box max-w-[260px] whitespace-pre-wrap break-words">
                      "{item.notes}"
                    </div>
                  ) : (
                    <span className="text-xs text-[var(--invite-sage)]">—</span>
                  )}
                </td>

                {/* Admin notes textarea */}
                <td className="px-5 py-5">
                  <textarea
                    className="min-h-[80px] w-full rounded-[14px] border border-[var(--invite-line)] bg-transparent px-3 py-2.5 text-sm text-[var(--invite-brown)] outline-none transition focus:border-[var(--invite-gold)]"
                    onChange={(e) =>
                      setDrafts((cur) => ({
                        ...cur,
                        [item.id]: {
                          ...cur[item.id],
                          admin_notes: e.target.value,
                        },
                      }))
                    }
                    placeholder="Notas do admin"
                    value={drafts[item.id]?.admin_notes ?? ""}
                  />
                </td>

                {/* Date */}
                <td className="px-5 py-5 text-sm text-[var(--invite-brown-soft)]">
                  <span className="whitespace-nowrap">
                    {new Date(item.created_at).toLocaleDateString("pt-BR")}
                  </span>
                  <span className="mt-0.5 block text-xs text-[var(--invite-sage)]">
                    {new Date(item.created_at).toLocaleTimeString("pt-BR", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </td>

                {/* Save action */}
                <td className="px-5 py-5">
                  <button
                    className="invite-button-primary min-h-10 px-4 py-2 text-[0.68rem]"
                    onClick={() => onSave(item)}
                    type="button"
                  >
                    {savingId === item.id ? (
                      <>
                        <Loader2 className="mr-2 size-3.5 animate-spin" />
                        Salvando
                      </>
                    ) : (
                      "Salvar"
                    )}
                  </button>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ===========================================
// SUBMISSIONS CARDS (MOBILE)
// ===========================================

function MobileCards({ items, drafts, setDrafts, savingId, onSave }: TableProps) {
  return (
    <div className="mt-8 space-y-4 lg:hidden">
      {items.map((item, index) => (
        <motion.article
          key={item.id}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.04 }}
          className="invite-card-strong px-5 py-6"
        >
          {/* Header: name + badge */}
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="admin-avatar flex-shrink-0">
                {item.guest_name.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="font-heading text-lg text-[var(--invite-brown)]">
                  {item.guest_name}
                </p>
                <p className="mt-0.5 text-sm text-[var(--invite-brown-soft)]">{item.phone}</p>
              </div>
            </div>
            <span className={badgeClassMap[item.attendance_status]}>
              {attendanceLabels[item.attendance_status]}
            </span>
          </div>

          {/* Info boxes */}
          <div className="mt-5 grid gap-3">
            <div className="rounded-[18px] border border-[var(--invite-line)] bg-[var(--invite-sage-soft)]/20 px-4 py-3">
              <p className="text-[0.65rem] uppercase tracking-[0.22em] text-[var(--invite-sage)]">
                Acompanhantes ({item.companions_count})
              </p>
              <p className="mt-1.5 text-sm text-[var(--invite-brown-soft)]">
                {item.companions_count > 0
                  ? item.companions_names.join(", ")
                  : "Sem acompanhantes"}
              </p>
            </div>

            {item.notes && (
              <div className="rounded-[18px] border border-[var(--invite-line)] bg-[var(--invite-sage-soft)]/20 px-4 py-3">
                <p className="text-[0.65rem] uppercase tracking-[0.22em] text-[var(--invite-sage)]">
                  Observações do convidado
                </p>
                <p className="mt-1.5 text-sm italic leading-relaxed text-[var(--invite-brown-soft)]">
                  "{item.notes}"
                </p>
              </div>
            )}
          </div>

          {/* Edit controls */}
          <div className="mt-5 grid gap-3">
            <select
              className="w-full rounded-[14px] border border-[var(--invite-line)] bg-transparent px-4 py-3 text-sm text-[var(--invite-brown)] outline-none transition focus:border-[var(--invite-gold)]"
              onChange={(e) =>
                setDrafts((cur) => ({
                  ...cur,
                  [item.id]: {
                    ...cur[item.id],
                    attendance_status: e.target.value as AttendanceStatus,
                  },
                }))
              }
              value={drafts[item.id]?.attendance_status ?? item.attendance_status}
            >
              {statusOptions.map((s) => (
                <option key={s} value={s}>
                  {attendanceLabels[s]}
                </option>
              ))}
            </select>

            <textarea
              className="min-h-24 w-full rounded-[14px] border border-[var(--invite-line)] bg-transparent px-4 py-3 text-sm text-[var(--invite-brown)] outline-none transition focus:border-[var(--invite-gold)]"
              onChange={(e) =>
                setDrafts((cur) => ({
                  ...cur,
                  [item.id]: {
                    ...cur[item.id],
                    admin_notes: e.target.value,
                  },
                }))
              }
              placeholder="Notas do admin"
              value={drafts[item.id]?.admin_notes ?? ""}
            />

            <button
              className="invite-button-primary flex w-full"
              onClick={() => onSave(item)}
              type="button"
            >
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

          <p className="mt-4 text-xs uppercase tracking-[0.18em] text-[var(--invite-sage)]">
            Enviado em {formatDisplayDateTime(item.created_at)}
          </p>
        </motion.article>
      ))}
    </div>
  );
}

// ===========================================
// MAIN ADMIN COMPONENT
// ===========================================

export default function AdminPage() {
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
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
    if (!data) return [];

    const term = deferredSearch.trim().toLowerCase();

    return (data.items ?? []).filter((item) => {
      const matchesStatus =
        statusFilter === "all" ? true : item.attendance_status === statusFilter;
      const matchesSearch =
        term.length === 0
          ? true
          : item.guest_name.toLowerCase().includes(term) || item.phone.includes(term);

      return matchesStatus && matchesSearch;
    });
  }, [data, deferredSearch, statusFilter]);

  async function handleLogin(password: string) {
    try {
      await adminLogin(password);
      toast.success("Acesso administrativo liberado.");
      await loadData();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Senha inválida.");
      throw error;
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
    if (!draft) return;

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

  // --- Loading state ---
  if (loading && !data && authenticated === false) {
    return (
      <div className="invite-page flex min-h-screen items-center justify-center">
        <Loader2 className="size-7 animate-spin text-[var(--invite-gold)]" />
      </div>
    );
  }

  // --- Login screen ---
  if (!authenticated) {
    return <LoginScreen onLogin={handleLogin} />;
  }

  // --- Authenticated: Admin Dashboard ---
  const summary = data?.summary;

  return (
    <div className="invite-page min-h-screen">
      {/* ===== STICKY HEADER ===== */}
      <header className="admin-header">
        <div className="invite-container flex items-center justify-between py-3.5">
          <div className="flex items-center gap-4">
            <Link
              to="/"
              className="flex size-10 items-center justify-center rounded-full text-[var(--invite-brown-soft)] transition hover:bg-[var(--invite-sage-soft)] hover:text-[var(--invite-brown)]"
            >
              <ArrowLeft className="size-5" />
            </Link>
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-full bg-[var(--invite-sage-soft)]">
                <GraduationCap className="size-5 text-[var(--invite-brown)]" />
              </div>
              <div className="flex flex-col">
                <h1 className="text-base font-bold tracking-wide text-[var(--invite-brown)] sm:text-lg">
                  Painel Administrativo
                </h1>
                <p className="text-[0.65rem] uppercase tracking-[0.2em] text-[var(--invite-sage)]">
                  Admin / Camilla
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              className="invite-button-secondary hidden min-h-9 px-4 py-2 text-xs sm:inline-flex"
              onClick={() => void loadData(true)}
              type="button"
            >
              <RefreshCw className="mr-2 size-3.5" />
              Atualizar
            </button>
            <a
              className="invite-button-secondary hidden min-h-9 px-4 py-2 text-xs sm:inline-flex"
              href="/api/admin/export/csv"
              target="_blank"
              rel="noreferrer"
            >
              <Download className="mr-2 size-3.5" />
              CSV
            </a>
            <button
              className="inline-flex min-h-9 items-center justify-center rounded-full border border-[var(--invite-line)] px-3 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-[var(--invite-brown-soft)] transition duration-200 hover:border-red-200 hover:bg-red-50 hover:text-red-600 sm:px-4"
              onClick={() => void handleLogout()}
              type="button"
            >
              <LogOut className="mr-1.5 size-3.5 sm:mr-2" />
              <span className="hidden sm:inline">Sair</span>
            </button>
          </div>
        </div>
      </header>

      {/* ===== MAIN CONTENT ===== */}
      <main className="invite-container py-8 sm:py-10">
        {/* Welcome */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-8"
        >
          <h2 className="font-script text-4xl text-[var(--invite-brown)] sm:text-5xl">
            Bem-vinda, Admin
          </h2>
          <p className="mt-3 max-w-2xl font-body text-xl leading-relaxed text-[var(--invite-brown-soft)]">
            Acompanhe as confirmações de presença, atualize status, registre observações e exporte a lista completa.
          </p>
        </motion.div>

        {/* Stats cards */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatsCard
            title="Respostas"
            value={summary?.total ?? 0}
            caption="formulários"
            icon={<Users className="size-16" />}
            delay={0.1}
          />
          <StatsCard
            title="Confirmados"
            value={summary?.attending ?? 0}
            caption="vão comparecer"
            icon={<GraduationCap className="size-16" />}
            delay={0.2}
          />
          <StatsCard
            title="Ausências"
            value={summary?.notAttending ?? 0}
            caption="não comparecerão"
            icon={<Calendar className="size-16" />}
            delay={0.3}
          />
          <StatsCard
            title="Total pessoas"
            value={summary?.totalPeople ?? 0}
            caption="com acompanhantes"
            icon={<Users className="size-16" />}
            delay={0.4}
          />
        </div>

        {/* Search & Filter bar */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45, duration: 0.4 }}
          className="invite-card mt-8 px-5 py-5"
        >
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-[var(--invite-brown-soft)]/40" />
              <input
                className="w-full rounded-[16px] border border-[var(--invite-line)] bg-transparent py-3.5 pl-11 pr-5 text-base text-[var(--invite-brown)] outline-none transition placeholder:text-[var(--invite-brown-soft)]/40 focus:border-[var(--invite-gold)] focus:bg-[var(--invite-paper)]"
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar por nome ou telefone..."
                value={searchTerm}
              />
            </div>

            <div className="flex flex-wrap gap-2">
              {(["all", ...statusOptions] as const).map((status) => (
                <button
                  key={status}
                  className={`admin-filter-btn ${
                    statusFilter === status ? "admin-filter-active" : "admin-filter-inactive"
                  }`}
                  onClick={() => setStatusFilter(status)}
                  type="button"
                >
                  {status === "all" ? "Todos" : attendanceLabels[status]}
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Mobile refresh/export buttons */}
        <div className="mt-4 flex gap-2 sm:hidden">
          <button
            className="invite-button-secondary flex-1 min-h-10 px-3 py-2 text-xs"
            onClick={() => void loadData(true)}
            type="button"
          >
            <RefreshCw className="mr-1.5 size-3.5" />
            Atualizar
          </button>
          <a
            className="invite-button-secondary flex-1 min-h-10 px-3 py-2 text-xs"
            href="/api/admin/export/csv"
            target="_blank"
            rel="noreferrer"
          >
            <Download className="mr-1.5 size-3.5" />
            CSV
          </a>
        </div>

        {/* Data loading state */}
        {loading && data && (
          <div className="mt-8 flex items-center justify-center py-12">
            <Loader2 className="size-6 animate-spin text-[var(--invite-gold)]" />
          </div>
        )}

        {/* Desktop Table */}
        {!loading && (
          <DesktopTable
            items={filteredItems}
            drafts={drafts}
            setDrafts={setDrafts}
            savingId={savingId}
            onSave={(item) => void handleSave(item)}
          />
        )}

        {/* Mobile Cards */}
        {!loading && (
          <MobileCards
            items={filteredItems}
            drafts={drafts}
            setDrafts={setDrafts}
            savingId={savingId}
            onSave={(item) => void handleSave(item)}
          />
        )}

        {/* Empty state */}
        {!loading && filteredItems.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="invite-card-strong mt-8 flex flex-col items-center justify-center gap-4 px-6 py-16 text-center"
          >
            <div className="flex size-20 items-center justify-center rounded-full bg-[var(--invite-sage-soft)]">
              <Users className="size-10 text-[var(--invite-sage)]" />
            </div>
            <h3 className="font-heading text-xl text-[var(--invite-brown)]">
              Nenhuma confirmação encontrada
            </h3>
            <p className="max-w-sm font-body text-lg leading-relaxed text-[var(--invite-brown-soft)]">
              As confirmações de presença aparecerão aqui assim que forem enviadas pelos convidados. Ajuste os filtros ou atualize o painel.
            </p>
          </motion.div>
        )}
      </main>
    </div>
  );
}
