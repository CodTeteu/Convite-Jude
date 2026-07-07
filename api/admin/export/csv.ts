import type { VercelRequest, VercelResponse } from "@vercel/node";
import { getExportFilename } from "../../../shared/constants.js";
import { eventSlug } from "../../../shared/invite.js";
import { requireAdmin } from "../../_lib/auth.js";
import { getSupabaseClient } from "../../_lib/supabase.js";

function escapeCsv(value: unknown) {
  const normalized = String(value ?? "");
  if (/[;"\r\n]/.test(normalized)) {
    return `"${normalized.replace(/"/g, "\"\"")}"`;
  }
  return normalized;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ error: "Método não permitido." });
  }

  if (!requireAdmin(req, res)) {
    return;
  }

  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from("rsvp_confirmations")
    .select(
      "guest_name, phone, attendance_status, companions_count, companions_names, notes, admin_notes, source, submitted_at, created_at",
    )
    .eq("event_slug", eventSlug)
    .order("created_at", { ascending: false });

  if (error) {
    return res.status(500).json({ error: "Não foi possível exportar o CSV." });
  }

  const rows = (data ?? []).map((item) => [
    item.guest_name,
    item.phone,
    item.attendance_status,
    item.companions_count,
    item.companions_names?.join(", ") ?? "",
    item.notes ?? "",
    item.admin_notes ?? "",
    item.source ?? "",
    item.submitted_at ?? "",
    item.created_at ?? "",
  ]);

  const csv = [
    [
      "Nome",
      "Telefone",
      "Status",
      "Quantidade Acompanhantes",
      "Nomes Acompanhantes",
      "Observacoes",
      "Observacoes Admin",
      "Origem",
      "Enviado Em",
      "Criado Em",
    ]
      .map(escapeCsv)
      .join(";"),
    ...rows.map((row) => row.map(escapeCsv).join(";")),
  ].join("\n");

  res.setHeader("Content-Type", "text/csv; charset=utf-8");
  res.setHeader(
    "Content-Disposition",
    `attachment; filename="${getExportFilename("confirmacoes", eventSlug)}"`,
  );
  return res.status(200).send(`\uFEFF${csv}`);
}
