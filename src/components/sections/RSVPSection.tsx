import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";
import {
  Loader2,
  Phone,
  User,
  Users,
} from "lucide-react";
import { toast } from "sonner";
import { rsvpSchema, type RSVPInput } from "@shared/schemas";
import { inviteData, buildWhatsAppMessage, defaultSource, eventSlug } from "@/config/invite";
import { submitRsvp } from "@/lib/api";
import { queueFailedSubmission } from "@/lib/pending-rsvp";
import { formatPhone } from "@/lib/format";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";

const defaultValues: RSVPInput = {
  guest_name: "",
  phone: "",
  attendance_status: "attending",
  companions_count: 0,
  companions_names: [],
  notes: "",
  acknowledged_guidelines: true,
  source: defaultSource,
  event_slug: eventSlug,
};

export function RSVPSection() {
  const {
    control,
    register,
    handleSubmit,
    getValues,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<RSVPInput>({
    resolver: zodResolver(rsvpSchema),
    defaultValues,
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
  const maxCompanions = inviteData.rsvp.maxCompanions;

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

  async function onSubmit(values: RSVPInput) {
    try {
      const payload = rsvpSchema.parse({
        ...values,
        source: defaultSource,
        event_slug: eventSlug,
      });
      await submitRsvp(payload);

      const message = buildWhatsAppMessage({
        name: payload.guest_name,
        attendance: payload.attendance_status,
        companionsNames: payload.companions_names,
      });

      const whatsappUrl = `https://wa.me/${inviteData.rsvp.whatsappIntl}?text=${encodeURIComponent(message)}`;

      toast.success(
        inviteData.rsvp.openWhatsAppAfterSubmit
          ? "Confirmação registrada! Redirecionando para o WhatsApp..."
          : inviteData.rsvp.successMessage,
      );
      reset(defaultValues);

      if (inviteData.rsvp.openWhatsAppAfterSubmit) {
        window.location.assign(whatsappUrl);
      }
    } catch {
      const payload = rsvpSchema.parse({
        ...getValues(),
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
