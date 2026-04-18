import { z } from "zod";
import { EVENT_SLUG, attendanceStatuses } from "./constants.js";

const phoneTransformer = z
  .string()
  .min(10, "Informe um telefone válido.")
  .max(20, "Telefone inválido.")
  .transform((value) => value.replace(/\D/g, ""));

const companionNameSchema = z
  .string()
  .trim()
  .min(2, "Informe o nome completo do acompanhante.")
  .max(80, "Nome muito longo.");

export const rsvpSchema = z
  .object({
    guest_name: z
      .string()
      .trim()
      .min(3, "Informe seu nome completo.")
      .max(120, "Nome muito longo."),
    phone: phoneTransformer.refine(
      (value) => value.length >= 10 && value.length <= 13,
      "Informe um telefone válido com DDD.",
    ),
    attendance_status: z.enum(["attending", "not-attending"]),
    companions_count: z.coerce
      .number()
      .int()
      .min(0, "Quantidade inválida.")
      .max(8, "Limite máximo de 8 acompanhantes."),
    companions_names: z.array(companionNameSchema).max(8).default([]),
    notes: z
      .string()
      .trim()
      .max(500, "As observações devem ter no máximo 500 caracteres.")
      .default(""),
    acknowledged_guidelines: z.literal(true, {
      message: "Confirme que leu as orientações para continuar.",
    }),
    source: z.string().trim().max(60).default("site"),
    event_slug: z.string().trim().default(EVENT_SLUG),
  })
  .transform((input) => {
    if (input.attendance_status === "not-attending") {
      return {
        ...input,
        companions_count: 0,
        companions_names: [],
      };
    }

    return {
      ...input,
      companions_names: input.companions_names.slice(0, input.companions_count),
    };
  })
  .superRefine((input, ctx) => {
    if (input.attendance_status === "attending") {
      if (input.companions_names.length !== input.companions_count) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["companions_names"],
          message: "Preencha o nome de cada acompanhante informado.",
        });
      }
    }
  });

export const adminLoginSchema = z.object({
  password: z.string().min(1, "Informe a senha."),
});

export const adminUpdateSchema = z
  .object({
    attendance_status: z.enum(attendanceStatuses).optional(),
    admin_notes: z
      .string()
      .trim()
      .max(500, "A observação do admin deve ter no máximo 500 caracteres.")
      .optional(),
  })
  .refine(
    (value) => value.attendance_status !== undefined || value.admin_notes !== undefined,
    "Nenhuma alteração informada.",
  );

export type RSVPInput = z.input<typeof rsvpSchema>;
export type RSVPSubmission = z.output<typeof rsvpSchema>;
export type AdminLoginInput = z.infer<typeof adminLoginSchema>;
export type AdminUpdateInput = z.infer<typeof adminUpdateSchema>;

export interface AdminRsvpItem {
  id: string;
  guest_name: string;
  phone: string;
  attendance_status: "pending" | "attending" | "not-attending";
  companions_count: number;
  companions_names: string[];
  notes: string;
  admin_notes: string;
  source: string;
  event_slug: string;
  submitted_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface AdminRsvpSummary {
  total: number;
  attending: number;
  notAttending: number;
  pending: number;
  totalPeople: number;
}

export interface AdminRsvpsResponse {
  items: AdminRsvpItem[];
  summary: AdminRsvpSummary;
}
