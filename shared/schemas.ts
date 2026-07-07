import { z } from "zod";
import { DEFAULT_EVENT_SLUG, attendanceStatuses, paymentStatuses } from "./constants.js";

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
      .max(20, "Limite máximo de 20 acompanhantes."),
    companions_names: z.array(companionNameSchema).max(20).default([]),
    notes: z
      .string()
      .trim()
      .max(500, "As observações devem ter no máximo 500 caracteres.")
      .default(""),
    acknowledged_guidelines: z.literal(true, {
      message: "Confirme que leu as orientações para continuar.",
    }),
    source: z.string().trim().max(60).default("site"),
    event_slug: z.string().trim().default(DEFAULT_EVENT_SLUG),
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

export const giftSelectionSchema = z.object({
  guest_name: z
    .string()
    .trim()
    .min(3, "Informe seu nome completo.")
    .max(120, "Nome muito longo."),
  guest_phone: phoneTransformer.refine(
    (value) => value.length >= 10 && value.length <= 13,
    "Informe um telefone válido com DDD.",
  ),
  message: z
    .string()
    .trim()
    .max(500, "A mensagem deve ter no máximo 500 caracteres.")
    .default(""),
  event_slug: z.string().trim().default(DEFAULT_EVENT_SLUG),
  items: z
    .array(
      z.object({
        gift_item_id: z.string().uuid("Presente inválido."),
        quantity: z.coerce.number().int().min(1).max(20),
      }),
    )
    .min(1, "Escolha pelo menos um presente."),
});

export const adminGiftSelectionUpdateSchema = z
  .object({
    payment_status: z.enum(paymentStatuses).optional(),
    admin_notes: z
      .string()
      .trim()
      .max(500, "A observação deve ter no máximo 500 caracteres.")
      .optional(),
  })
  .refine(
    (value) => value.payment_status !== undefined || value.admin_notes !== undefined,
    "Nenhuma alteração informada.",
  );

export type RSVPInput = z.input<typeof rsvpSchema>;
export type RSVPSubmission = z.output<typeof rsvpSchema>;
export type AdminLoginInput = z.infer<typeof adminLoginSchema>;
export type AdminUpdateInput = z.infer<typeof adminUpdateSchema>;
export type GiftSelectionInput = z.input<typeof giftSelectionSchema>;
export type GiftSelectionSubmission = z.output<typeof giftSelectionSchema>;
export type AdminGiftSelectionUpdateInput = z.infer<typeof adminGiftSelectionUpdateSchema>;

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

export interface GiftItem {
  id: string;
  name: string;
  description: string;
  price_cents: number;
  category: string;
  image_url: string;
  is_active: boolean;
  sort_order: number;
}

export interface GiftSelectionItem {
  id: string;
  gift_item_id: string;
  name: string;
  quantity: number;
  unit_price_cents: number;
}

export interface GiftSelectionWithItems {
  id: string;
  guest_name: string;
  guest_phone: string;
  message: string;
  total_cents: number;
  payment_status: "pending" | "paid" | "cancelled";
  admin_notes: string;
  created_at: string;
  updated_at: string;
  items: GiftSelectionItem[];
}

export interface AdminGiftSelectionsResponse {
  items: GiftSelectionWithItems[];
  summary: {
    total: number;
    pending: number;
    paid: number;
    cancelled: number;
    totalPaidCents: number;
  };
}
