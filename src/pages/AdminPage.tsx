import { useDeferredValue, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Calendar,
  CheckCircle2,
  Clock,
  Download,
  GraduationCap,
  Loader2,
  LogOut,
  MessageSquare,
  Phone,
  RefreshCw,
  Search,
  ShieldCheck,
  Ticket,
  Trash2,
  UserPlus,
  Users,
  XCircle,
} from "lucide-react";
import { toast } from "sonner";
import type { AdminRsvpItem, AdminRsvpsResponse } from "@shared/schemas";
import { attendanceLabels, type AttendanceStatus } from "@shared/constants";
import { inviteData } from "@/config/invite";
import { AdminTabs, type AdminTab } from "@/features/admin/AdminTabs";
import { GiftSelectionsPanel } from "@/features/admin/GiftSelectionsPanel";
import { ApiError, adminLogin, adminLogout, deleteAdminRsvp, fetchAdminRsvps, withBasePath, updateAdminRsvp } from "@/lib/api";
import { formatDisplayDateTime } from "@/lib/format";
import { cn } from "@/lib/cn";

// ===========================================
// CONSTANTS
// ===========================================

const statusOptions: AttendanceStatus[] = ["pending", "attending", "not-attending"];

const badgeClassMap: Record<AttendanceStatus, string> = {
  attending: "admin-badge admin-badge-attending",
  "not-attending": "admin-badge admin-badge-not-attending",
  pending: "admin-badge admin-badge-pending",
};

const statusIconMap: Record<AttendanceStatus, React.ReactNode> = {
  attending: <CheckCircle2 className="size-3.5" />,
  "not-attending": <XCircle className="size-3.5" />,
  pending: <Clock className="size-3.5" />,
};

// ===========================================
// LOGIN SCREEN
// ===========================================

function LoginScreen({ onLogin }: { onLogin: (password: string) => Promise<void> }) {
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
    <div className="relative flex h-[100svh] items-center justify-center overflow-hidden px-4 py-4 sm:min-h-screen sm:px-5 sm:py-16">
      <div className="admin-login-bg" />
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="invite-card-strong relative z-10 w-full max-w-md px-5 py-7 sm:px-10 sm:py-10"
      >
        <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-[var(--invite-sage-soft)] text-[var(--invite-brown)] sm:size-16">
          <ShieldCheck className="size-5 sm:size-7" />
        </div>
        <p className="mt-4 text-center font-heading text-[0.68rem] uppercase tracking-[0.3em] text-[var(--invite-sage)] sm:mt-6 sm:text-[0.72rem] sm:tracking-[0.32em]">
          Área administrativa
        </p>
        <h1 className="mt-2 text-center font-heading text-3xl text-[var(--invite-brown)] sm:mt-4 sm:text-4xl">
          Acesso restrito
        </h1>
        <p className="mt-2 text-center font-body text-base leading-relaxed text-[var(--invite-brown-soft)] sm:mt-4 sm:text-lg">
          Digite a senha administrativa para gerenciar as confirmações de presença.
        </p>
        <form className="mt-5 space-y-4 sm:mt-8 sm:space-y-5" onSubmit={handleSubmit}>
          <div>
            <label className="mb-2 block text-sm font-medium text-[var(--invite-brown-soft)]">
              Senha administrativa
            </label>
            <div className="relative">
              <input
                className="w-full rounded-[16px] border border-[var(--invite-line)] bg-transparent py-3.5 pl-11 pr-5 text-lg text-[var(--invite-brown)] outline-none transition placeholder:text-[var(--invite-brown-soft)]/40 focus:border-[var(--invite-gold)] focus:bg-[var(--invite-paper)] sm:py-4"
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                type="password"
                value={password}
                disabled={submitting}
              />
              <ShieldCheck className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-[var(--invite-brown-soft)]/40" />
            </div>
          </div>
          <button className="invite-button-primary flex w-full" disabled={submitting} type="submit">
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
        <div className="mt-5 flex justify-center sm:mt-8">
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
// STATS CARD
// ===========================================

function StatsCard({
  title,
  value,
  caption,
  icon,
  delay = 0,
}: {
  title: string;
  value: number;
  caption: string;
  icon: React.ReactNode;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
    >
      <div className="admin-stat-card group">
        <div className="absolute -right-2 -top-2 text-[var(--invite-sage-soft)] opacity-20 transition-opacity group-hover:opacity-30">
          {icon}
        </div>
        <p className="relative z-10 text-[0.68rem] uppercase tracking-[0.28em] text-[var(--invite-sage)]">
          {title}
        </p>
        <p className="relative z-10 mt-3 font-heading text-4xl text-[var(--invite-brown)]">
          {value}
        </p>
        <p className="relative z-10 mt-2 text-sm text-[var(--invite-brown-soft)]">{caption}</p>
      </div>
    </motion.div>
  );
}

// ===========================================
// DELETE CONFIRMATION DIALOG
// ===========================================

function DeleteConfirmDialog({
  guestName,
  onConfirm,
  onCancel,
  deleting,
}: {
  guestName: string;
  onConfirm: () => void;
  onCancel: () => void;
  deleting: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/30 backdrop-blur-sm px-4"
      onClick={onCancel}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="invite-card-strong w-full max-w-sm px-6 py-8 text-center"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-red-50">
          <Trash2 className="size-6 text-red-500" />
        </div>
        <h3 className="mt-5 font-heading text-xl text-[var(--invite-brown)]">
          Excluir confirmação?
        </h3>
        <p className="mt-3 text-sm leading-relaxed text-[var(--invite-brown-soft)]">
          A resposta de <strong className="text-[var(--invite-brown)]">{guestName}</strong> será
          removida permanentemente do banco de dados.
        </p>
        <div className="mt-6 flex gap-3">
          <button
            className="invite-button-secondary flex-1 min-h-10 px-4 py-2 text-xs"
            onClick={onCancel}
            disabled={deleting}
            type="button"
          >
            Cancelar
          </button>
          <button
            className="flex-1 inline-flex min-h-10 items-center justify-center rounded-full bg-red-600 px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-white transition hover:bg-red-700 disabled:opacity-50"
            onClick={onConfirm}
            disabled={deleting}
            type="button"
          >
            {deleting ? (
              <>
                <Loader2 className="mr-1.5 size-3.5 animate-spin" />
                Excluindo...
              </>
            ) : (
              "Excluir"
            )}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ===========================================
// READ-ONLY SUBMISSION CARD (MOBILE)
// ===========================================

function SubmissionCard({
  item,
  onDelete,
  onUpdateBingoStatus,
}: {
  item: AdminRsvpItem;
  onDelete: (item: AdminRsvpItem) => void;
  onUpdateBingoStatus: (id: string, currentStatus: "pending" | "paid" | "unpaid") => void;
}) {
  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="invite-card-strong px-5 py-5"
    >
      {/* Header: name + badge */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="admin-avatar flex-shrink-0">
            {item.guest_name.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="font-heading text-lg text-[var(--invite-brown)]">{item.guest_name}</p>
            <div className="mt-0.5 flex items-center gap-1.5 text-sm text-[var(--invite-brown-soft)]">
              <Phone className="size-3" />
              {item.phone}
            </div>
            {(() => {
              const events = getEventsInfo(item);
              if (!events) return null;
              return (
                <div className="mt-2 flex items-center gap-1 w-fit rounded bg-[var(--invite-gold)]/10 border border-[var(--invite-gold)]/20 px-2 py-0.5 text-[9px] font-semibold text-[var(--invite-gold-deep)] uppercase tracking-wider font-sans">
                  <Calendar className="size-2.5 shrink-0" />
                  <span>{events}</span>
                </div>
              );
            })()}
          </div>
        </div>
        <span className={`${badgeClassMap[item.attendance_status]} flex items-center gap-1.5`}>
          {statusIconMap[item.attendance_status]}
          {attendanceLabels[item.attendance_status]}
        </span>
      </div>

      {/* Info rows */}
      <div className="mt-4 space-y-2.5">
        {/* Companions */}
        <div className="flex items-start gap-2.5 text-sm">
          <UserPlus className="mt-0.5 size-3.5 flex-shrink-0 text-[var(--invite-sage)]" />
          <span className="text-[var(--invite-brown-soft)]">
            {item.companions_count > 0
              ? `${item.companions_count} acompanhante${item.companions_count > 1 ? "s" : ""}: ${item.companions_names.join(", ")}`
              : "Sem acompanhantes"}
          </span>
        </div>

        {/* Notes */}
        {(() => {
          const cleaned = cleanNotes(item.notes);
          if (!cleaned) return null;
          return (
            <div className="flex items-start gap-2.5 text-sm">
              <MessageSquare className="mt-0.5 size-3.5 flex-shrink-0 text-[var(--invite-sage)]" />
              <span className="italic leading-relaxed text-[var(--invite-brown-soft)]">
                "{cleaned}"
              </span>
            </div>
          );
        })()}

        {/* Bingo Status */}
        {(() => {
          const info = getBingoInfo(item);
          if (!info) return null;
          
          return (
            <div className="flex items-center justify-between gap-2.5 text-sm pt-2.5 border-t border-[var(--invite-line)]/30 mt-2.5">
              <div className="flex items-center gap-2.5">
                <Ticket className="size-3.5 text-[var(--invite-gold)] shrink-0" />
                <span className="font-heading text-xs font-semibold text-[var(--invite-brown)] font-sans">
                  Bingo: {info.count} cartela{info.count > 1 ? "s" : ""} (R$ {info.value},00)
                </span>
              </div>
              <select
                value={info.status}
                onChange={(e) => onUpdateBingoStatus(item.id, e.target.value as "pending" | "paid" | "unpaid")}
                className={cn(
                  "rounded-full border px-3 py-1 text-[10px] font-semibold outline-none cursor-pointer transition-all duration-200 shrink-0",
                  info.status === "paid" && "bg-green-50 border-green-200 text-green-700 hover:bg-green-100",
                  info.status === "unpaid" && "bg-red-50 border-red-200 text-red-700 hover:bg-red-100",
                  info.status === "pending" && "bg-yellow-50 border-yellow-200 text-yellow-700 hover:bg-yellow-100"
                )}
              >
                <option value="pending" className="bg-white text-yellow-700 font-semibold">Pendente</option>
                <option value="paid" className="bg-white text-green-700 font-semibold">Pago</option>
                <option value="unpaid" className="bg-white text-red-700 font-semibold">Não Pago</option>
              </select>
            </div>
          );
        })()}
      </div>

      {/* Footer: date + delete */}
      <div className="mt-4 flex items-center justify-between border-t border-[var(--invite-line)] pt-3">
        <p className="text-xs uppercase tracking-[0.16em] text-[var(--invite-sage)]">
          {formatDisplayDateTime(item.created_at)}
        </p>
        <button
          className="inline-flex items-center gap-1.5 rounded-full border border-transparent px-3 py-1.5 text-xs font-medium text-[var(--invite-brown-soft)] transition hover:border-red-200 hover:bg-red-50 hover:text-red-600"
          onClick={() => onDelete(item)}
          type="button"
        >
          <Trash2 className="size-3.5" />
          Excluir
        </button>
      </div>
    </motion.article>
  );
}

// Helper to parse Bingo info from guest notes and payment status from admin notes
function getBingoInfo(item: AdminRsvpItem) {
  const match = (item.notes || "").match(/\[Bingo:\s*(\d+)\s*cartela\(s\)/);
  if (!match) return null;
  const count = parseInt(match[1], 10);
  
  let status: "pending" | "paid" | "unpaid" = "pending";
  if ((item.admin_notes || "").includes("[Bingo: PAGO]")) {
    status = "paid";
  } else if ((item.admin_notes || "").includes("[Bingo: NAO_PAGO]")) {
    status = "unpaid";
  }
  
  return { count, status, value: count * 10 };
}

// Helper to parse selected events from notes
function getEventsInfo(item: AdminRsvpItem) {
  const match = (item.notes || "").match(/\[Eventos:\s*([^\]]+)\]/);
  if (!match) return null;
  return match[1];
}

// Helper to clean up technical metadata from guest notes
function cleanNotes(notes: string | null) {
  if (!notes) return "";
  return notes
    .replace(/\[Eventos:\s*[^\]]+\]/g, "")
    .replace(/\[Bingo:\s*[^\]]+\]/g, "")
    .trim();
}

// ===========================================
// READ-ONLY TABLE (DESKTOP)
// ===========================================

function SubmissionsTable({
  items,
  onDelete,
  onUpdateBingoStatus,
}: {
  items: AdminRsvpItem[];
  onDelete: (item: AdminRsvpItem) => void;
  onUpdateBingoStatus: (id: string, currentStatus: "pending" | "paid" | "unpaid") => void;
}) {
  return (
    <div className="invite-card mt-8 hidden overflow-hidden lg:block">
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr className="admin-table-header">
              <th className="px-5 py-4 font-medium">Convidado</th>
              <th className="px-5 py-4 font-medium">Status</th>
              <th className="px-5 py-4 font-medium text-center">Pessoas</th>
              <th className="px-5 py-4 font-medium">Acompanhantes</th>
              <th className="px-5 py-4 font-medium">Observações</th>
              <th className="px-5 py-4 font-medium text-center">Bingo / Pix</th>
              <th className="px-5 py-4 font-medium">Envio</th>
              <th className="px-5 py-4 font-medium w-[80px]"></th>
            </tr>
          </thead>
          <tbody>
            <AnimatePresence>
              {items.map((item, index) => (
                <motion.tr
                  key={item.id}
                  layout
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ delay: index * 0.02 }}
                  className="admin-table-row align-middle"
                >
                  {/* Guest name + phone */}
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="admin-avatar flex-shrink-0">
                        {item.guest_name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-heading text-base font-semibold text-[var(--invite-brown)]">
                          {item.guest_name}
                        </p>
                        <p className="mt-0.5 flex items-center gap-1 text-xs text-[var(--invite-brown-soft)]">
                          <Phone className="size-3" />
                          {item.phone}
                        </p>
                        {(() => {
                          const events = getEventsInfo(item);
                          if (!events) return null;
                          return (
                            <div className="mt-1.5 flex items-center gap-1 w-fit rounded bg-[var(--invite-gold)]/10 border border-[var(--invite-gold)]/20 px-2 py-0.5 text-[9px] font-semibold text-[var(--invite-gold-deep)] uppercase tracking-wider font-sans">
                              <Calendar className="size-2.5 shrink-0" />
                              <span>{events}</span>
                            </div>
                          );
                        })()}
                      </div>
                    </div>
                  </td>

                  {/* Status badge */}
                  <td className="px-5 py-4">
                    <span className={`${badgeClassMap[item.attendance_status]} flex w-fit items-center gap-1.5`}>
                      {statusIconMap[item.attendance_status]}
                      {attendanceLabels[item.attendance_status]}
                    </span>
                  </td>

                  {/* Total people */}
                  <td className="px-5 py-4 text-center">
                    <span className="inline-flex size-8 items-center justify-center rounded-full bg-[var(--invite-sage-soft)]/40 text-sm font-semibold text-[var(--invite-brown)]">
                      {item.companions_count + 1}
                    </span>
                  </td>

                  {/* Companion names */}
                  <td className="max-w-[200px] px-5 py-4 text-sm text-[var(--invite-brown-soft)]">
                    {item.companions_count > 0
                      ? item.companions_names.join(", ")
                      : <span className="text-[var(--invite-sage)]">—</span>}
                  </td>

                  {/* Notes */}
                  <td className="max-w-[260px] px-5 py-4">
                    {(() => {
                      const cleaned = cleanNotes(item.notes);
                      if (!cleaned) return <span className="text-xs text-[var(--invite-sage)]">—</span>;
                      return (
                        <div className="admin-message-box whitespace-pre-wrap break-words">
                          "{cleaned}"
                        </div>
                      );
                    })()}
                  </td>

                  {/* Bingo / Pix status */}
                  <td className="px-5 py-4 text-center">
                    {(() => {
                      const info = getBingoInfo(item);
                      if (!info) return <span className="text-[var(--invite-sage)]">—</span>;
                      
                      return (
                        <div className="flex flex-col items-center justify-center">
                          <span className="text-[10px] uppercase tracking-wider text-black/60 font-sans block mb-1">
                            {info.count} cartela{info.count > 1 ? "s" : ""}
                          </span>
                          <select
                            value={info.status}
                            onChange={(e) => onUpdateBingoStatus(item.id, e.target.value as "pending" | "paid" | "unpaid")}
                            className={cn(
                              "rounded-2xl border px-3 py-1.5 transition duration-200 text-xs font-semibold outline-none cursor-pointer text-center w-full max-w-[125px] mx-auto block",
                              info.status === "paid" && "bg-green-50 border-green-200 text-green-700 hover:bg-green-100",
                              info.status === "unpaid" && "bg-red-50 border-red-200 text-red-700 hover:bg-red-100",
                              info.status === "pending" && "bg-yellow-50 border-yellow-200 text-yellow-700 hover:bg-yellow-100"
                            )}
                          >
                            <option value="pending" className="bg-white text-yellow-700 font-semibold">Pendente</option>
                            <option value="paid" className="bg-white text-green-700 font-semibold">Pago</option>
                            <option value="unpaid" className="bg-white text-red-700 font-semibold">Não Pago</option>
                          </select>
                        </div>
                      );
                    })()}
                  </td>

                  {/* Date */}
                  <td className="px-5 py-4 text-sm text-[var(--invite-brown-soft)]">
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

                  {/* Delete */}
                  <td className="px-5 py-4">
                    <button
                      className="flex size-9 items-center justify-center rounded-full text-[var(--invite-brown-soft)] transition hover:bg-red-50 hover:text-red-600"
                      onClick={() => onDelete(item)}
                      title="Excluir resposta"
                      type="button"
                    >
                      <Trash2 className="size-4" />
                    </button>
                  </td>
                </motion.tr>
              ))}
            </AnimatePresence>
          </tbody>
        </table>
      </div>
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
  const [searchTerm, setSearchTerm] = useState("");
  const deferredSearch = useDeferredValue(searchTerm);
  const [statusFilter, setStatusFilter] = useState<AttendanceStatus | "all">("all");
  const [eventFilter, setEventFilter] = useState<"all" | "colacao" | "jantar" | "both">("all");
  const [activeTab, setActiveTab] = useState<AdminTab>("rsvps");

  // Delete state
  const [deleteTarget, setDeleteTarget] = useState<AdminRsvpItem | null>(null);
  const [deleting, setDeleting] = useState(false);

  async function loadData(showToast = false) {
    try {
      setLoading(true);
      const response = await fetchAdminRsvps();
      setAuthenticated(true);
      setData(response);
      if (showToast) toast.success("Painel atualizado.");
    } catch (error) {
      if (error instanceof ApiError && (error.status === 401 || error.status === 503)) {
        setAuthenticated(false);
        setData(null);
      } else {
        toast.error(
          error instanceof Error ? error.message : "Não foi possível carregar as confirmações.",
        );
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const timeout = window.setTimeout(() => void loadData(), 0);
    return () => window.clearTimeout(timeout);
  }, []);

  const filteredItems = useMemo(() => {
    if (!data) return [];
    const term = deferredSearch.trim().toLowerCase();
    return (data.items ?? []).filter((item) => {
      const matchesStatus =
        statusFilter === "all" ? true : item.attendance_status === statusFilter;

      const eventsInfo = getEventsInfo(item);
      const matchesEvent =
        eventFilter === "all"
          ? true
          : eventFilter === "colacao"
          ? eventsInfo === "Apenas Colação de Grau"
          : eventFilter === "jantar"
          ? eventsInfo === "Apenas Jantar de Celebração"
          : eventsInfo === "Ambos os Eventos";

      const matchesSearch =
        term.length === 0
          ? true
          : item.guest_name.toLowerCase().includes(term) || item.phone.includes(term);

      return matchesStatus && matchesEvent && matchesSearch;
    });
  }, [data, deferredSearch, statusFilter, eventFilter]);

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

  async function handleDelete() {
    if (!deleteTarget) return;
    try {
      setDeleting(true);
      await deleteAdminRsvp(deleteTarget.id);
      toast.success(`Resposta de "${deleteTarget.guest_name}" excluída.`);
      setDeleteTarget(null);
      await loadData();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Não foi possível excluir o registro.",
      );
    } finally {
      setDeleting(false);
    }
  }

  async function handleUpdateBingoStatus(id: string, nextStatus: "pending" | "paid" | "unpaid") {
    let newAdminNotes = "";
    if (nextStatus === "paid") {
      newAdminNotes = "[Bingo: PAGO]";
    } else if (nextStatus === "unpaid") {
      newAdminNotes = "[Bingo: NAO_PAGO]";
    } else {
      newAdminNotes = "[Bingo: PENDENTE]";
    }

    try {
      await updateAdminRsvp(id, { admin_notes: newAdminNotes });
      toast.success("Status do pagamento do Bingo atualizado.");
      await loadData();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Não foi possível atualizar o status de pagamento.",
      );
    }
  }

  // --- Loading ---
  if (loading && !data && authenticated === false) {
    return (
      <div className="invite-page flex min-h-screen items-center justify-center">
        <Loader2 className="size-7 animate-spin text-[var(--invite-gold)]" />
      </div>
    );
  }

  // --- Login ---
  if (!authenticated) {
    return <LoginScreen onLogin={handleLogin} />;
  }

  // --- Dashboard ---
  const summary = data?.summary;

  return (
    <div className="invite-page min-h-screen">
      {/* Delete confirmation dialog */}
      <AnimatePresence>
        {deleteTarget && (
          <DeleteConfirmDialog
            guestName={deleteTarget.guest_name}
            onConfirm={() => void handleDelete()}
            onCancel={() => setDeleteTarget(null)}
            deleting={deleting}
          />
        )}
      </AnimatePresence>

      {/* Header */}
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
                  Admin / {inviteData.footer.name}
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
              href={withBasePath("/api/admin/export/csv")}
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

      {/* Main */}
      <main className="invite-container py-8 sm:py-10">
        <AdminTabs
          active={activeTab}
          giftsEnabled={inviteData.features.giftList && inviteData.giftList.enabled}
          onChange={setActiveTab}
        />
        {activeTab === "gifts" && inviteData.features.giftList && inviteData.giftList.enabled ? (
          <GiftSelectionsPanel />
        ) : (
          <>
        {/* Welcome */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h2 className="font-script text-4xl text-[var(--invite-brown)] sm:text-5xl">
            Confirmações recebidas
          </h2>
          <p className="mt-3 max-w-2xl font-body text-xl leading-relaxed text-[var(--invite-brown-soft)]">
            Todas as respostas dos convidados aparecem automaticamente aqui. Nenhuma ação manual é
            necessária para confirmar o que foi enviado.
          </p>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
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

        {/* Search & Filter */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
          className="invite-card mt-8 px-5 py-5"
        >
          <div className="flex flex-col gap-5">
            {/* Search Input (Full Width) */}
            <div className="relative">
              <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-[var(--invite-brown-soft)]/40" />
              <input
                className="w-full rounded-[16px] border border-[var(--invite-line)] bg-transparent py-3.5 pl-11 pr-5 text-base text-[var(--invite-brown)] outline-none transition placeholder:text-[var(--invite-brown-soft)]/40 focus:border-[var(--invite-gold)] focus:bg-[var(--invite-paper)]"
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar por nome ou telefone..."
                value={searchTerm}
              />
            </div>

            {/* Filters (Side-by-side on desktop) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-[var(--invite-line)]/30">
              {/* Status Filter Block */}
              <div className="flex flex-col gap-2">
                <span className="text-[10px] uppercase tracking-wider text-[var(--invite-brown-soft)]/85 font-heading">Filtrar por Presença:</span>
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

              {/* Event Filter Block */}
              <div className="flex flex-col gap-2">
                <span className="text-[10px] uppercase tracking-wider text-[var(--invite-brown-soft)]/85 font-heading">Filtrar por Evento:</span>
                <div className="flex flex-wrap gap-2">
                  {([
                    { value: "all", label: "Todos os Eventos" },
                    { value: "colacao", label: "Apenas Colação" },
                    { value: "jantar", label: "Apenas Jantar" },
                    { value: "both", label: "Colação e Jantar" }
                  ] as const).map((option) => (
                    <button
                      key={option.value}
                      className={`admin-filter-btn ${
                        eventFilter === option.value ? "admin-filter-active" : "admin-filter-inactive"
                      }`}
                      onClick={() => setEventFilter(option.value)}
                      type="button"
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Mobile buttons */}
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
            href={withBasePath("/api/admin/export/csv")}
            target="_blank"
            rel="noreferrer"
          >
            <Download className="mr-1.5 size-3.5" />
            CSV
          </a>
        </div>

        {/* Loading */}
        {loading && data && (
          <div className="mt-8 flex items-center justify-center py-12">
            <Loader2 className="size-6 animate-spin text-[var(--invite-gold)]" />
          </div>
        )}

        {/* Desktop Table (read-only) */}
        {!loading && filteredItems.length > 0 && (
          <SubmissionsTable
            items={filteredItems}
            onDelete={setDeleteTarget}
            onUpdateBingoStatus={handleUpdateBingoStatus}
          />
        )}

        {/* Mobile Cards (read-only) */}
        {!loading && filteredItems.length > 0 && (
          <div className="mt-8 space-y-4 lg:hidden">
            <AnimatePresence>
              {filteredItems.map((item) => (
                <SubmissionCard
                  key={item.id}
                  item={item}
                  onDelete={setDeleteTarget}
                  onUpdateBingoStatus={handleUpdateBingoStatus}
                />
              ))}
            </AnimatePresence>
          </div>
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
              As confirmações de presença aparecerão automaticamente aqui assim que forem enviadas
              pelos convidados.
            </p>
          </motion.div>
        )}
          </>
        )}
      </main>
    </div>
  );
}
