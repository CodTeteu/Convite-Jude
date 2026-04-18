import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";
import {
  CheckCircle2,
  Loader2,
  MessageCircleMore,
  MessageSquareText,
  Phone,
  User,
  Users,
} from "lucide-react";
import { toast } from "sonner";
import { rsvpSchema, type RSVPInput } from "@shared/schemas";
import { inviteData, buildWhatsAppMessage, defaultSource, eventSlug } from "@/config/invite";
import { submitRsvp } from "@/lib/api";
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
  const [submittedName, setSubmittedName] = useState<string | null>(null);
  const [whatsAppUrl, setWhatsAppUrl] = useState<string | null>(null);

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

    if (currentNames.length !== companionsCount) {
      setValue(
        "companions_names",
        Array.from({ length: companionsCount }, (_, index) => currentNames[index] ?? ""),
      );
    }
  }, [attendanceStatus, companionsCount, getValues, setValue]);

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

      setSubmittedName(payload.guest_name);
      setWhatsAppUrl(
        `https://wa.me/${inviteData.rsvp.whatsappIntl}?text=${encodeURIComponent(message)}`,
      );
      toast.success(inviteData.rsvp.successMessage);
      reset(defaultValues);
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Não foi possível registrar sua confirmação.",
      );
    }
  }

  return (
    <section className="invite-section" id="rsvp">
      <div className="invite-container">
        <div className="mx-auto max-w-3xl text-center">
          <SectionHeading
            align="center"
            description={inviteData.rsvp.description}
            label={inviteData.rsvp.label}
            title={inviteData.rsvp.title}
          />
        </div>

        <Reveal className="invite-card mx-auto mt-12 max-w-4xl px-5 py-6 sm:px-8 sm:py-9" delay={0.08}>
          <div className="rounded-[26px] border border-[#dcc9ae] bg-[#f5ead9] px-5 py-5">
            <p className="font-heading text-[0.72rem] uppercase tracking-[0.3em] text-[var(--invite-gold)]">
              Informações importantes
            </p>
            <ul className="mt-4 space-y-2 text-[var(--invite-brown-soft)]">
              {inviteData.rsvp.infoItems.map((item) => (
                <li className="font-body text-xl leading-relaxed sm:text-2xl" key={item}>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <div className="grid gap-5 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className="mb-2 block font-heading text-[0.72rem] uppercase tracking-[0.28em] text-[var(--invite-gold)]">
                  Nome completo
                </label>
                <div className="relative">
                  <User className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-[var(--invite-gold)]" />
                  <input
                    className="w-full rounded-[22px] border border-[var(--invite-line)] bg-[var(--invite-paper)] px-11 py-4 text-[1.05rem] text-[var(--invite-brown)] outline-none transition placeholder:text-[var(--invite-gold-deep)] focus:border-[var(--invite-line)]"
                    placeholder="Nome e sobrenome"
                    {...register("guest_name")}
                  />
                </div>
                {errors.guest_name ? (
                  <p className="mt-2 text-sm text-rose-600">{errors.guest_name.message}</p>
                ) : null}
              </div>

              <div className="sm:col-span-2">
                <label className="mb-2 block font-heading text-[0.72rem] uppercase tracking-[0.28em] text-[var(--invite-gold)]">
                  WhatsApp
                </label>
                <div className="relative">
                  <Phone className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-[var(--invite-gold)]" />
                  <input
                    className="w-full rounded-[22px] border border-[var(--invite-line)] bg-[var(--invite-paper)] px-11 py-4 text-[1.05rem] text-[var(--invite-brown)] outline-none transition placeholder:text-[var(--invite-gold-deep)] focus:border-[var(--invite-line)]"
                    placeholder="(31) 98743-0940"
                    {...register("phone")}
                    onChange={(event) => {
                      setValue("phone", formatPhone(event.target.value));
                    }}
                    value={phoneValue}
                  />
                </div>
                {errors.phone ? (
                  <p className="mt-2 text-sm text-rose-600">{errors.phone.message}</p>
                ) : null}
              </div>
            </div>

            <div>
              <p className="mb-3 font-heading text-[0.72rem] uppercase tracking-[0.28em] text-[var(--invite-gold)]">
                Você comparecerá?
              </p>
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="cursor-pointer">
                  <input className="peer sr-only" type="radio" value="attending" {...register("attendance_status")} />
                  <span className="block rounded-[24px] border border-[#d8c5aa] bg-[var(--invite-paper)] px-5 py-5 transition peer-checked:border-[var(--invite-line)] peer-checked:bg-[#f4eadb]">
                    <span className="font-heading text-xl text-[var(--invite-brown)]">Sim</span>
                    <span className="mt-2 block font-body text-xl leading-relaxed text-[var(--invite-brown-soft)]">
                      Quero celebrar esse momento com você.
                    </span>
                  </span>
                </label>
                <label className="cursor-pointer">
                  <input className="peer sr-only" type="radio" value="not-attending" {...register("attendance_status")} />
                  <span className="block rounded-[24px] border border-[#d8c5aa] bg-[var(--invite-paper)] px-5 py-5 transition peer-checked:border-[var(--invite-line)] peer-checked:bg-[#f4eadb]">
                    <span className="font-heading text-xl text-[var(--invite-brown)]">Não</span>
                    <span className="mt-2 block font-body text-xl leading-relaxed text-[var(--invite-brown-soft)]">
                      Ainda assim deixarei meu carinho registrado.
                    </span>
                  </span>
                </label>
              </div>
            </div>

            {attendanceStatus === "attending" ? (
              <>
                <div>
                  <label className="mb-2 block font-heading text-[0.72rem] uppercase tracking-[0.28em] text-[var(--invite-gold)]">
                    Número de acompanhantes
                  </label>
                  <select
                    className="w-full rounded-[22px] border border-[var(--invite-line)] bg-[var(--invite-paper)] px-4 py-4 text-[1.05rem] text-[var(--invite-brown)] outline-none transition focus:border-[var(--invite-line)]"
                    {...register("companions_count")}
                  >
                    {Array.from({ length: 9 }, (_, number) => (
                      <option key={number} value={number}>
                        {number === 0 ? "Apenas eu" : `${number} acompanhante${number > 1 ? "s" : ""}`}
                      </option>
                    ))}
                  </select>
                </div>

                {companionsCount > 0 ? (
                  <div className="grid gap-4">
                    {Array.from({ length: companionsCount }, (_, index) => (
                      <div key={`companion-${index}`}>
                        <label className="mb-2 block font-heading text-[0.72rem] uppercase tracking-[0.28em] text-[var(--invite-gold)]">
                          Acompanhante {index + 1}
                        </label>
                        <div className="relative">
                          <Users className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-[var(--invite-gold)]" />
                          <input
                            className="w-full rounded-[22px] border border-[var(--invite-line)] bg-[var(--invite-paper)] px-11 py-4 text-[1.05rem] text-[var(--invite-brown)] outline-none transition placeholder:text-[var(--invite-gold-deep)] focus:border-[var(--invite-line)]"
                            placeholder="Nome completo"
                            {...register(`companions_names.${index}` as const)}
                          />
                        </div>
                      </div>
                    ))}
                    {errors.companions_names ? (
                      <p className="text-sm text-rose-600">
                        {errors.companions_names.message as string}
                      </p>
                    ) : null}
                  </div>
                ) : null}
              </>
            ) : null}

            <div>
              <label className="mb-2 block font-heading text-[0.72rem] uppercase tracking-[0.28em] text-[var(--invite-gold)]">
                Deixe um recado
              </label>
              <div className="relative">
                <MessageSquareText className="pointer-events-none absolute left-4 top-5 size-4 text-[var(--invite-gold)]" />
                <textarea
                  className="min-h-32 w-full rounded-[22px] border border-[var(--invite-line)] bg-[var(--invite-paper)] px-11 py-4 text-[1.05rem] text-[var(--invite-brown)] outline-none transition placeholder:text-[var(--invite-gold-deep)] focus:border-[var(--invite-line)]"
                  placeholder="Se desejar, escreva um recado carinhoso para a formanda."
                  {...register("notes")}
                />
              </div>
              {errors.notes ? (
                <p className="mt-2 text-sm text-rose-600">{errors.notes.message}</p>
              ) : null}
            </div>


            <button
              className="invite-button-primary flex w-full"
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

        {submittedName ? (
          <Reveal className="invite-card mx-auto mt-6 flex max-w-4xl items-start gap-4 px-6 py-6" delay={0.1}>
            <CheckCircle2 className="mt-1 size-6 text-emerald-600" />
            <div>
              <p className="font-heading text-2xl text-[var(--invite-brown)]">
                Confirmação registrada para {submittedName}.
              </p>
              <p className="mt-3 font-body text-xl leading-relaxed text-[var(--invite-brown-soft)] sm:text-2xl">
                {inviteData.rsvp.successMessage}
              </p>
              {whatsAppUrl ? (
                <a
                  className="invite-button-primary mt-5 inline-flex"
                  href={whatsAppUrl}
                  rel="noreferrer"
                  target="_blank"
                >
                  <MessageCircleMore className="mr-2 size-4" />
                  Continuar no WhatsApp
                </a>
              ) : null}
            </div>
          </Reveal>
        ) : null}
      </div>
    </section>
  );
}
