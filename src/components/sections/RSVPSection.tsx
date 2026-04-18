import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";
import { CheckCircle2, Loader2, MessageCircleMore } from "lucide-react";
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
    <section className="section-shell" id="rsvp">
      <div className="grid gap-8 lg:grid-cols-[0.92fr_1.08fr]">
        <div className="lg:pt-8">
          <SectionHeading
            label={inviteData.rsvp.label}
            title={inviteData.rsvp.title}
            description={inviteData.rsvp.description}
          />

          <Reveal className="mt-8 card-luxe px-6 py-7">
            <p className="text-[0.68rem] uppercase tracking-[0.28em] text-[color:var(--color-gold-soft)]/72">
              Informações importantes
            </p>
            <ul className="mt-5 space-y-4 text-base leading-7 text-white/72">
              <li>Confirmação até {inviteData.event.confirmationDeadline}.</li>
              <li>Convidados não pagam e não há pagamento na confirmação.</li>
              <li>Não existe área de presentes, PIX ou cardápio a exibir.</li>
              <li>Traje passeio completo.</li>
            </ul>
          </Reveal>

          {submittedName ? (
            <Reveal className="mt-6 panel-luxe px-6 py-7">
              <div className="flex items-start gap-4">
                <CheckCircle2 className="mt-1 size-6 text-emerald-400" />
                <div>
                  <p className="text-lg text-[color:var(--color-paper)]">
                    Confirmação registrada para {submittedName}.
                  </p>
                  <p className="mt-3 text-base leading-7 text-white/72">
                    {inviteData.rsvp.successMessage}
                  </p>
                  {whatsAppUrl ? (
                    <a
                      className="button-primary mt-5 inline-flex"
                      href={whatsAppUrl}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <MessageCircleMore className="mr-2 size-4" />
                      Continuar no WhatsApp
                    </a>
                  ) : null}
                </div>
              </div>
            </Reveal>
          ) : null}
        </div>

        <Reveal className="panel-luxe px-5 py-6 sm:px-7 sm:py-7">
          <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
            <div className="grid gap-5 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className="mb-2 block text-[0.7rem] uppercase tracking-[0.25em] text-white/58">
                  Nome completo
                </label>
                <input
                  className="w-full rounded-[22px] border border-white/10 bg-black/12 px-4 py-4 text-base outline-none transition placeholder:text-white/24 focus:border-[color:var(--color-gold)]/45"
                  placeholder="Digite seu nome"
                  {...register("guest_name")}
                />
                {errors.guest_name ? (
                  <p className="mt-2 text-sm text-rose-300">{errors.guest_name.message}</p>
                ) : null}
              </div>

              <div className="sm:col-span-2">
                <label className="mb-2 block text-[0.7rem] uppercase tracking-[0.25em] text-white/58">
                  Telefone
                </label>
                <input
                  className="w-full rounded-[22px] border border-white/10 bg-black/12 px-4 py-4 text-base outline-none transition placeholder:text-white/24 focus:border-[color:var(--color-gold)]/45"
                  placeholder="(31) 98743-0940"
                  {...register("phone")}
                  onChange={(event) => {
                    setValue("phone", formatPhone(event.target.value));
                  }}
                  value={phoneValue}
                />
                {errors.phone ? (
                  <p className="mt-2 text-sm text-rose-300">{errors.phone.message}</p>
                ) : null}
              </div>
            </div>

            <div>
              <p className="mb-3 text-[0.7rem] uppercase tracking-[0.25em] text-white/58">
                Presença
              </p>
              <div className="grid gap-3 sm:grid-cols-2">
                <label className="card-luxe cursor-pointer px-4 py-4">
                  <input
                    className="sr-only"
                    type="radio"
                    value="attending"
                    {...register("attendance_status")}
                  />
                  <span className="text-sm uppercase tracking-[0.25em] text-[color:var(--color-gold-soft)]/72">
                    Sim, estarei presente
                  </span>
                  <p className="mt-2 text-base text-white/74">
                    Quero celebrar esse momento com você.
                  </p>
                </label>
                <label className="card-luxe cursor-pointer px-4 py-4">
                  <input
                    className="sr-only"
                    type="radio"
                    value="not-attending"
                    {...register("attendance_status")}
                  />
                  <span className="text-sm uppercase tracking-[0.25em] text-[color:var(--color-gold-soft)]/72">
                    Não poderei comparecer
                  </span>
                  <p className="mt-2 text-base text-white/74">
                    Ainda assim deixarei meu carinho registrado.
                  </p>
                </label>
              </div>
            </div>

            {attendanceStatus === "attending" ? (
              <>
                <div>
                  <label className="mb-2 block text-[0.7rem] uppercase tracking-[0.25em] text-white/58">
                    Quantidade de acompanhantes
                  </label>
                  <select
                    className="w-full rounded-[22px] border border-white/10 bg-black/12 px-4 py-4 text-base outline-none transition focus:border-[color:var(--color-gold)]/45"
                    {...register("companions_count")}
                  >
                    {Array.from({ length: 9 }, (_, number) => (
                      <option key={number} value={number}>
                        {number}
                      </option>
                    ))}
                  </select>
                </div>

                {companionsCount > 0 ? (
                  <div className="grid gap-4">
                    {Array.from({ length: companionsCount }, (_, index) => (
                      <div key={`companion-${index}`}>
                        <label className="mb-2 block text-[0.7rem] uppercase tracking-[0.25em] text-white/58">
                          Acompanhante {index + 1}
                        </label>
                        <input
                          className="w-full rounded-[22px] border border-white/10 bg-black/12 px-4 py-4 text-base outline-none transition placeholder:text-white/24 focus:border-[color:var(--color-gold)]/45"
                          placeholder="Nome completo"
                          {...register(`companions_names.${index}` as const)}
                        />
                      </div>
                    ))}
                    {errors.companions_names ? (
                      <p className="text-sm text-rose-300">
                        {errors.companions_names.message as string}
                      </p>
                    ) : null}
                  </div>
                ) : null}
              </>
            ) : null}

            <div>
              <label className="mb-2 block text-[0.7rem] uppercase tracking-[0.25em] text-white/58">
                Observações
              </label>
              <textarea
                className="min-h-32 w-full rounded-[22px] border border-white/10 bg-black/12 px-4 py-4 text-base outline-none transition placeholder:text-white/24 focus:border-[color:var(--color-gold)]/45"
                placeholder="Se desejar, escreva um recado ou alguma informação importante."
                {...register("notes")}
              />
              {errors.notes ? (
                <p className="mt-2 text-sm text-rose-300">{errors.notes.message}</p>
              ) : null}
            </div>

            <label className="flex items-start gap-3 rounded-[22px] border border-white/10 bg-black/10 px-4 py-4">
              <input
                className="mt-1 size-4 rounded border-white/20 bg-transparent accent-[color:var(--color-gold)]"
                type="checkbox"
                {...register("acknowledged_guidelines")}
              />
              <span className="text-sm leading-7 text-white/72">
                Li as orientações do convite, entendi que este é um evento único e que
                não existe cobrança, presente ou pagamento na confirmação.
              </span>
            </label>
            {errors.acknowledged_guidelines ? (
              <p className="text-sm text-rose-300">
                {errors.acknowledged_guidelines.message}
              </p>
            ) : null}

            <button
              className="button-primary flex w-full"
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
