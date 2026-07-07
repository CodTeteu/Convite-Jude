import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";
import { z } from "zod";
import {
  Loader2,
  Phone,
  User,
  Users,
  Copy,
  Check,
  Ticket,
  Calendar,
} from "lucide-react";
import { toast } from "sonner";
import { rsvpSchema } from "@shared/schemas";
import { inviteData, buildWhatsAppMessage, defaultSource, eventSlug } from "@/config/invite";
import { submitRsvp } from "@/lib/api";
import { queueFailedSubmission } from "@/lib/pending-rsvp";
import { formatPhone } from "@/lib/format";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";

const rsvpFormSchema = z
  .object({
    guest_name: z
      .string()
      .trim()
      .min(3, "Informe seu nome completo.")
      .max(120, "Nome muito longo."),
    phone: z
      .string()
      .min(10, "Informe um telefone válido com DDD.")
      .max(20, "Telefone inválido."),
    attendance_status: z.enum(["attending", "not-attending"]),
    companions_count: z.coerce
      .number()
      .int()
      .min(0, "Quantidade inválida.")
      .max(20, "Limite máximo de 20 acompanhantes."),
    companions_names: z.array(z.string().trim().min(2, "Informe o nome completo do acompanhante.")).max(20).default([]),
    notes: z
      .string()
      .trim()
      .max(500, "As observações devem ter no máximo 500 caracteres.")
      .default(""),
    selected_events: z.string().default(""),
    bingo_option: z.string().default(""),
  })
  .superRefine((data, ctx) => {
    if (data.attendance_status === "attending") {
      if (!data.selected_events) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["selected_events"],
          message: "Selecione quais eventos você irá comparecer.",
        });
      }
      if (!data.bingo_option) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["bingo_option"],
          message: "Selecione uma opção para o Bingo.",
        });
      }
    }
  });

interface RSVPFormValues {
  guest_name: string;
  phone: string;
  attendance_status: "attending" | "not-attending";
  companions_count: number;
  companions_names: string[];
  notes: string;
  selected_events: string;
  bingo_option: string;
}

const defaultFormValues: RSVPFormValues = {
  guest_name: "",
  phone: "",
  attendance_status: "attending",
  companions_count: 0,
  companions_names: [],
  notes: "",
  selected_events: "",
  bingo_option: "",
};

export function RSVPSection() {
  const [copyingPix, setCopyingPix] = useState<boolean>(false);

  const {
    control,
    register,
    handleSubmit,
    getValues,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<RSVPFormValues>({
    resolver: zodResolver(rsvpFormSchema) as any,
    defaultValues: defaultFormValues,
  });

  const attendanceStatus = useWatch({
    control,
    name: "attendance_status",
  });
  const companionsCount = Number(
    useWatch({
      control,
      name: "companions_count",
    }) || 0,
  );
  const phoneValue =
    useWatch({
      control,
      name: "phone",
    }) || "";
  const bingoOption = useWatch({
    control,
    name: "bingo_option",
  }) || "";
  const selectedEvents = useWatch({
    control,
    name: "selected_events",
  }) || "";

  const bingoCardsCount = Number(bingoOption) || 0;
  const maxCompanions = inviteData.rsvp.maxCompanions;

  async function handleCopyPix(pixKey: string) {
    try {
      setCopyingPix(true);
      const name = getValues("guest_name") || "";
      const phone = getValues("phone") || "";
      const currentSelectedEvents = getValues("selected_events") || "";
      const currentBingoOption = getValues("bingo_option") || "";

      if (!name.trim() || name.trim().length < 3 || !phone.trim() || phone.replace(/\D/g, "").length < 10) {
        toast.error("Por favor, preencha seu Nome e Celular no topo do formulário antes de copiar a chave Pix, para podermos registrar seu pagamento!");
        setCopyingPix(false);
        return;
      }

      if (!currentSelectedEvents) {
        toast.error("Por favor, selecione os Eventos que irá comparecer antes de copiar a chave Pix!");
        setCopyingPix(false);
        return;
      }

      if (!currentBingoOption) {
        toast.error("Por favor, responda sobre a aquisição de cartelas do Bingo antes de copiar a chave Pix!");
        setCopyingPix(false);
        return;
      }

      await navigator.clipboard.writeText(pixKey);
      toast.success("Chave Pix copiada com sucesso!");

      // Submit RSVP in the background to log the purchase intention in Supabase immediately
      const eventLabelMap: Record<string, string> = {
        colacao: "Apenas Colação de Grau",
        jantar: "Apenas Jantar de Celebração",
        both: "Ambos os Eventos",
        none: "Nenhum",
      };

      const eventLabel = eventLabelMap[currentSelectedEvents] || "Nenhum";
      const eventNotes = `[Eventos: ${eventLabel}]`;
      const bingoNote = bingoCardsCount > 0
        ? ` [Bingo: ${bingoCardsCount} cartela(s) - R$ ${bingoCardsCount * 10}]`
        : " [Bingo: Não deseja cartelas]";

      let rawNotes = getValues("notes") || "";
      const extraNotes = `${eventNotes}${bingoNote}`;
      if (rawNotes.length + extraNotes.length > 490) {
        rawNotes = rawNotes.substring(0, 490 - extraNotes.length) + "...";
      }
      const finalNotes = rawNotes + extraNotes;

      const payload = {
        guest_name: name.trim(),
        phone: phone.replace(/\D/g, ""),
        attendance_status: (getValues("attendance_status") || "attending") as "attending" | "not-attending",
        companions_count: Number(getValues("companions_count") || 0),
        companions_names: getValues("companions_names") || [],
        notes: finalNotes,
        acknowledged_guidelines: true as const,
        source: defaultSource,
        event_slug: eventSlug,
      };

      submitRsvp(payload)
        .then(() => {
          toast.success("Chave Pix copiada! Pedido registrado no painel administrativo.");
        })
        .catch((err) => {
          console.error("Erro ao registrar intenção de bingo no Supabase:", err);
          queueFailedSubmission(payload);
        });
    } catch {
      toast.error("Erro ao copiar a chave Pix.");
    } finally {
      setTimeout(() => setCopyingPix(false), 2000);
    }
  }

  useEffect(() => {
    const currentNames = getValues("companions_names") ?? [];
    const currentCount = Number(getValues("companions_count") || 0);

    if (attendanceStatus === "not-attending") {
      if (currentCount !== 0) {
        setValue("companions_count", 0);
      }

      if (currentNames.length !== 0) {
        setValue("companions_names", []);
      }

      return;
    }

    if (currentCount > maxCompanions) {
      setValue("companions_count", maxCompanions);
      return;
    }

    if (currentNames.length !== companionsCount) {
      setValue(
        "companions_names",
        Array.from({ length: companionsCount }, (_, index) => currentNames[index] ?? ""),
      );
    }
  }, [attendanceStatus, companionsCount, getValues, maxCompanions, setValue]);

  async function onSubmit(values: RSVPFormValues) {
    try {
      const eventLabelMap: Record<string, string> = {
        colacao: "Apenas Colação de Grau",
        jantar: "Apenas Jantar de Celebração",
        both: "Ambos os Eventos",
        none: "Nenhum",
      };

      const eventLabel = values.attendance_status === "attending"
        ? eventLabelMap[values.selected_events] || "Nenhum"
        : "Nenhum";

      const eventNotes = `[Eventos: ${eventLabel}]`;
      const bingoNote = values.attendance_status === "attending" && bingoCardsCount > 0
        ? ` [Bingo: ${bingoCardsCount} cartela(s) - R$ ${bingoCardsCount * 10}]`
        : " [Bingo: Não deseja cartelas]";

      let rawNotes = values.notes || "";
      const extraNotes = `${eventNotes}${bingoNote}`;
      if (rawNotes.length + extraNotes.length > 490) {
        rawNotes = rawNotes.substring(0, 490 - extraNotes.length) + "...";
      }
      const finalNotes = rawNotes + extraNotes;

      const payload = rsvpSchema.parse({
        guest_name: values.guest_name,
        phone: values.phone,
        attendance_status: values.attendance_status,
        companions_count: values.companions_count,
        companions_names: values.companions_names,
        notes: finalNotes,
        acknowledged_guidelines: true,
        source: defaultSource,
        event_slug: eventSlug,
      });

      await submitRsvp(payload);

      const message = buildWhatsAppMessage({
        name: payload.guest_name,
        attendance: payload.attendance_status,
        companionsNames: payload.companions_names,
        bingoCardsCount: payload.attendance_status === "attending" ? bingoCardsCount : 0,
        selectedEvents: payload.attendance_status === "attending" ? values.selected_events : undefined,
      });

      const whatsappUrl = `https://wa.me/${inviteData.rsvp.whatsappIntl}?text=${encodeURIComponent(message)}`;

      toast.success(
        inviteData.rsvp.openWhatsAppAfterSubmit
          ? "Confirmação registrada! Redirecionando para o WhatsApp..."
          : inviteData.rsvp.successMessage,
      );
      reset(defaultFormValues);

      if (inviteData.rsvp.openWhatsAppAfterSubmit) {
        window.location.assign(whatsappUrl);
      }
    } catch {
      const eventLabelMap: Record<string, string> = {
        colacao: "Apenas Colação de Grau",
        jantar: "Apenas Jantar de Celebração",
        both: "Ambos os Eventos",
        none: "Nenhum",
      };

      const eventLabel = attendanceStatus === "attending"
        ? eventLabelMap[selectedEvents] || "Nenhum"
        : "Nenhum";

      const eventNotes = `[Eventos: ${eventLabel}]`;
      const bingoNote = attendanceStatus === "attending" && bingoCardsCount > 0
        ? ` [Bingo: ${bingoCardsCount} cartela(s) - R$ ${bingoCardsCount * 10}]`
        : " [Bingo: Não deseja cartelas]";

      let rawNotes = getValues("notes") || "";
      const extraNotes = `${eventNotes}${bingoNote}`;
      if (rawNotes.length + extraNotes.length > 490) {
        rawNotes = rawNotes.substring(0, 490 - extraNotes.length) + "...";
      }
      const finalNotes = rawNotes + extraNotes;

      const payload = rsvpSchema.parse({
        ...getValues(),
        notes: finalNotes,
        source: defaultSource,
        event_slug: eventSlug,
      });
      queueFailedSubmission(payload);

      toast.error(
        "Servidor indisponível no momento. Sua confirmação foi salva e será enviada automaticamente quando o serviço retornar.",
        { duration: 8000 },
      );
    }
  }

  return (
    <section className="invite-section !pt-8 sm:!pt-12" id="rsvp">
      <div className="invite-container">
        <div className="mx-auto max-w-3xl text-center">
          <SectionHeading
            align="center"
            description={inviteData.rsvp.description}
            label={inviteData.rsvp.label}
            title={inviteData.rsvp.title}
          />
        </div>

        <Reveal className="bg-white rounded-3xl p-6 md:p-12 shadow-xl border border-[var(--invite-line)]/35 max-w-4xl mx-auto mt-12" delay={0.08}>
          <div className="rounded-2xl border border-[var(--invite-line)]/30 bg-[var(--invite-sage-soft)]/20 px-5 py-5 mb-8">
            <p className="font-heading text-[0.72rem] uppercase tracking-[0.3em] text-[var(--invite-sage)] mb-3">
              Informações importantes
            </p>
            <ul className="space-y-2 text-[var(--invite-brown-soft)]">
              {inviteData.rsvp.infoItems.map((item) => (
                <li className="font-body text-sm leading-relaxed sm:text-base" key={item}>
                  &bull; {item}
                </li>
              ))}
            </ul>
          </div>

          <form className="space-y-8" onSubmit={handleSubmit(onSubmit)}>
            {/* SEUS DADOS */}
            <div>
              <div className="mb-6">
                <h3 className="font-heading text-xl text-[var(--invite-brown)] sm:text-2xl">Seus Dados</h3>
                <hr className="mt-3 border-[var(--invite-line)]/50" />
              </div>
              <div className="grid gap-6 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label className="mb-2 flex items-center gap-2 font-body text-sm text-[var(--invite-brown-soft)] sm:text-base">
                    <User className="size-4 text-[var(--invite-sage)]" />
                    Nome Completo <span className="text-rose-400">*</span>
                  </label>
                  <input
                    className="w-full rounded-xl border border-[var(--invite-line)] bg-[var(--invite-cream)]/10 px-5 py-3.5 font-sans text-base text-[var(--invite-brown)] outline-none transition-all duration-300 focus:border-[var(--invite-gold)] focus:bg-white focus:ring-2 focus:ring-[var(--invite-gold)]/20"
                    placeholder="Seu nome completo"
                    {...register("guest_name")}
                  />
                  {errors.guest_name ? (
                    <p className="mt-2 text-sm text-rose-600">{errors.guest_name.message}</p>
                  ) : null}
                </div>

                <div className="sm:col-span-2">
                  <label className="mb-2 flex items-center gap-2 font-body text-sm text-[var(--invite-brown-soft)] sm:text-base">
                    <Phone className="size-4 text-[var(--invite-sage)]" />
                    Celular / WhatsApp <span className="text-rose-400">*</span>
                  </label>
                  <input
                    className="w-full rounded-xl border border-[var(--invite-line)] bg-[var(--invite-cream)]/10 px-5 py-3.5 font-sans text-base text-[var(--invite-brown)] outline-none transition-all duration-300 focus:border-[var(--invite-gold)] focus:bg-white focus:ring-2 focus:ring-[var(--invite-gold)]/20"
                    placeholder="(00) 00000-0000"
                    {...register("phone")}
                    onChange={(event) => {
                      setValue("phone", formatPhone(event.target.value));
                    }}
                    value={phoneValue}
                  />
                  {errors.phone ? (
                    <p className="mt-2 text-sm text-rose-600">{errors.phone.message}</p>
                  ) : null}
                </div>
              </div>
            </div>

            {/* PARTICIPAÇÃO */}
            <div>
              <div className="mb-6">
                <h3 className="font-heading text-xl text-[var(--invite-brown)] sm:text-2xl">Participação</h3>
                <hr className="mt-3 border-[var(--invite-line)]/50" />
              </div>
              <div className="space-y-4">
                <p className="font-body text-sm text-[var(--invite-brown-soft)]">
                  Você poderá comparecer?
                </p>
                <div className="grid grid-cols-2 gap-4">
                  <label
                    className={`flex items-center justify-center gap-2 py-4 px-4 rounded-xl border-2 cursor-pointer transition-all duration-300 ${
                      attendanceStatus === "attending"
                        ? "border-[var(--invite-brown)] bg-[var(--invite-brown)]/5 shadow-md"
                        : "border-[var(--invite-line)]/60 hover:border-[var(--invite-brown)]/30"
                    }`}
                  >
                    <input className="peer sr-only" type="radio" value="attending" {...register("attendance_status")} />
                    <span className="font-heading text-base text-[var(--invite-brown)]">
                      Sim, irei!
                    </span>
                  </label>
                  
                  <label
                    className={`flex items-center justify-center gap-2 py-4 px-4 rounded-xl border-2 cursor-pointer transition-all duration-300 ${
                      attendanceStatus === "not-attending"
                        ? "border-[var(--invite-brown)] bg-[var(--invite-brown)]/5 shadow-md"
                        : "border-[var(--invite-line)]/60 hover:border-[var(--invite-brown)]/30"
                    }`}
                  >
                    <input className="peer sr-only" type="radio" value="not-attending" {...register("attendance_status")} />
                    <span className="font-heading text-base text-[var(--invite-brown)]/70">
                      Não poderei ir
                    </span>
                  </label>
                </div>
              </div>
            </div>

            {/* SELEÇÃO DE EVENTOS */}
            {attendanceStatus === "attending" && (
              <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                <div className="mb-6">
                  <h3 className="font-heading text-xl text-[var(--invite-brown)] sm:text-2xl flex items-center gap-2">
                    <Calendar className="size-5 text-[var(--invite-gold)]" />
                    Quais eventos você irá comparecer? <span className="text-rose-400">*</span>
                  </h3>
                  <hr className="mt-3 border-[var(--invite-line)]/50" />
                </div>

                <div>
                  <select
                    className="w-full rounded-xl border border-[var(--invite-line)] bg-[var(--invite-cream)]/10 px-5 py-3.5 font-sans text-base text-[var(--invite-brown)] outline-none transition-all duration-300 focus:border-[var(--invite-gold)] focus:bg-white focus:ring-2 focus:ring-[var(--invite-gold)]/20"
                    {...register("selected_events")}
                  >
                    <option value="">Selecione uma opção...</option>
                    <option value="colacao">Apenas Colação de Grau (7 de agosto)</option>
                    <option value="jantar">Apenas Jantar de Celebração (8 de agosto)</option>
                    <option value="both">Ambos os Eventos (Colação e Jantar)</option>
                  </select>
                  {errors.selected_events ? (
                    <p className="mt-2 text-sm text-rose-600">{errors.selected_events.message as string}</p>
                  ) : null}
                </div>
              </div>
            )}

            {/* ACOMPANHANTES */}
            {attendanceStatus === "attending" && (
              <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                <div className="mb-6">
                  <h3 className="font-heading text-xl text-[var(--invite-brown)] sm:text-2xl">Acompanhantes</h3>
                  <hr className="mt-3 border-[var(--invite-line)]/50" />
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="mb-2 flex items-center gap-2 font-body text-sm text-[var(--invite-brown-soft)] sm:text-base">
                      <Users className="size-4 text-[var(--invite-sage)]" />
                      Número de acompanhantes
                    </label>
                    <select
                      className="w-full rounded-xl border border-[var(--invite-line)] bg-[var(--invite-cream)]/10 px-5 py-3.5 font-sans text-base text-[var(--invite-brown)] outline-none transition-all duration-300 focus:border-[var(--invite-gold)] focus:bg-white focus:ring-2 focus:ring-[var(--invite-gold)]/20"
                      {...register("companions_count")}
                    >
                      {Array.from({ length: maxCompanions + 1 }, (_, number) => (
                        <option key={number} value={number}>
                          {number === 0 ? "Apenas eu" : `${number} acompanhante${number > 1 ? "s" : ""}`}
                        </option>
                      ))}
                    </select>
                  </div>

                  {companionsCount > 0 && (
                    <div className="grid gap-6 sm:grid-cols-2">
                      {Array.from({ length: companionsCount }, (_, index) => (
                        <div key={`companion-${index}`}>
                          <label className="mb-2 flex items-center gap-2 font-body text-sm text-[var(--invite-brown-soft)]">
                            <User className="size-4 text-[var(--invite-sage)]" />
                            Acompanhante {index + 1}
                          </label>
                          <input
                            className="w-full rounded-xl border border-[var(--invite-line)] bg-[var(--invite-cream)]/10 px-5 py-3.5 font-sans text-base text-[var(--invite-brown)] outline-none transition-all duration-300 focus:border-[var(--invite-gold)] focus:bg-white focus:ring-2 focus:ring-[var(--invite-gold)]/20"
                            placeholder="Nome completo"
                            {...register(`companions_names.${index}` as const)}
                          />
                        </div>
                      ))}
                    </div>
                  )}
                  {errors.companions_names ? (
                    <p className="text-sm text-rose-600">
                      {errors.companions_names.message as string}
                    </p>
                  ) : null}
                </div>
              </div>
            )}

            {/* RECADO */}
            <div>
              <div className="mb-6">
                <h3 className="font-heading text-xl text-[var(--invite-brown)] sm:text-2xl">
                  Deixe um recado
                </h3>
                <hr className="mt-3 border-[var(--invite-line)]/50" />
              </div>
              <div>
                <textarea
                  className="min-h-32 w-full rounded-xl border border-[var(--invite-line)] bg-[var(--invite-cream)]/10 px-5 py-3.5 font-sans text-base text-[var(--invite-brown)] outline-none transition-all duration-300 focus:border-[var(--invite-gold)] focus:bg-white focus:ring-2 focus:ring-[var(--invite-gold)]/20"
                  placeholder={inviteData.rsvp.messagePlaceholder}
                  {...register("notes")}
                />
                {errors.notes ? (
                  <p className="mt-2 text-sm text-rose-600">{errors.notes.message}</p>
                ) : null}
              </div>
            </div>

            {/* COMPRA DE CARTELAS (BINGO) */}
            {attendanceStatus === "attending" && (
              <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                <div className="mb-6">
                  <h3 className="font-heading text-xl text-[var(--invite-brown)] sm:text-2xl flex items-center gap-2">
                    <Ticket className="size-5 text-[var(--invite-gold)]" />
                    Cartela do Bingo Especial <span className="text-rose-400">*</span>
                  </h3>
                  <hr className="mt-3 border-[var(--invite-line)]/50" />
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="mb-2 flex items-center gap-2 font-body text-sm text-[var(--invite-brown-soft)] sm:text-base">
                      Deseja adquirir cartelas antecipadas? (R$ 10,00 cada)
                    </label>
                    <select
                      className="w-full rounded-xl border border-[var(--invite-line)] bg-[var(--invite-cream)]/10 px-5 py-3.5 font-sans text-base text-[var(--invite-brown)] outline-none transition-all duration-300 focus:border-[var(--invite-gold)] focus:bg-white focus:ring-2 focus:ring-[var(--invite-gold)]/20"
                      {...register("bingo_option")}
                    >
                      <option value="">Selecione uma opção...</option>
                      <option value="0">Não desejo adquirir no momento</option>
                      <option value="1">1 cartela — R$ 10,00</option>
                      <option value="2">2 cartelas — R$ 20,00</option>
                      <option value="3">3 cartelas — R$ 30,00</option>
                      <option value="4">4 cartelas — R$ 40,00</option>
                      <option value="5">5 cartelas — R$ 50,00</option>
                    </select>
                    {errors.bingo_option ? (
                      <p className="mt-2 text-sm text-rose-600">{errors.bingo_option.message as string}</p>
                    ) : null}
                  </div>

                  {bingoCardsCount > 0 && (
                    <div className="rounded-2xl border border-[var(--invite-gold)]/25 bg-[#fffbf2]/70 p-5 animate-in fade-in slide-in-from-top-2 duration-300">
                      <p className="font-heading text-xs text-[var(--invite-gold-deep)] uppercase tracking-wider mb-2 font-semibold">Pagamento via Pix</p>
                      <p className="text-xs text-[var(--invite-brown-soft)] mb-4 leading-relaxed">
                        Realize o pagamento de <strong>R$ {bingoCardsCount * 10},00</strong> copiando a chave Pix abaixo. O comprovante Pix deve ser enviado no WhatsApp a seguir.
                      </p>
                      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
                        <div className="flex-1 bg-white border border-[var(--invite-line)] rounded-xl px-4 py-3 font-sans text-xs text-[var(--invite-brown)] select-all break-all text-center sm:text-left">
                          {inviteData.giftList.pixKey}
                        </div>
                        <button
                          type="button"
                          onClick={() => void handleCopyPix(inviteData.giftList.pixKey)}
                          className="inline-flex items-center justify-center gap-2 bg-[var(--invite-brown)] hover:bg-[var(--invite-brown-soft)] text-white px-5 py-3 rounded-xl font-sans text-xs font-semibold transition-colors duration-300 shrink-0"
                        >
                          {copyingPix ? <Check className="size-4 text-[var(--invite-gold)]" /> : <Copy className="size-4" />}
                          Copiar Chave
                        </button>
                      </div>
                      <p className="text-[10px] text-[var(--invite-brown-soft)]/60 mt-3 text-center sm:text-left">
                        Titular: {inviteData.giftList.pixName}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            <button
              className="invite-button-primary flex w-full justify-center items-center py-4 bg-[var(--invite-brown)] text-white hover:bg-[var(--invite-brown-soft)] transition-colors duration-300 rounded-full font-heading tracking-widest text-sm"
              disabled={isSubmitting}
              type="submit"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 size-4 animate-spin" />
                  Enviando confirmação
                </>
              ) : (
                "Enviar confirmação"
              )}
            </button>
          </form>
        </Reveal>
      </div>
    </section>
  );
}
