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

      const whatsappUrl = `https://wa.me/${inviteData.rsvp.whatsappIntl}?text=${encodeURIComponent(message)}`;
      
      // Delay slightly to ensure toast is visible or database save is initiated
      setTimeout(() => {
        window.open(whatsappUrl, "_blank");
      }, 800);

      toast.success("Redirecionando para o WhatsApp...");
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

        <Reveal className="invite-card mx-auto mt-12 max-w-4xl px-5 py-6 sm:px-8 sm:py-9" delay={0.08}>
          <div className="rounded-[26px] border border-[var(--invite-line)] bg-[var(--invite-sage-soft)]/30 px-5 py-5">
            <p className="font-heading text-[0.72rem] uppercase tracking-[0.3em] text-[var(--invite-sage)]">
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

          <form className="mt-8 space-y-10" onSubmit={handleSubmit(onSubmit)}>
            {/* SEUS DADOS */}
            <div>
              <div className="mb-6">
                <h3 className="font-heading text-2xl text-[var(--invite-brown)] sm:text-3xl">Seus Dados</h3>
                <hr className="mt-3 border-[var(--invite-line)]" />
              </div>
              <div className="grid gap-6 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label className="mb-2 flex items-center gap-2 font-body text-xl text-[var(--invite-brown-soft)]">
                    <User className="size-4" />
                    Nome Completo <span className="text-rose-400">*</span>
                  </label>
                  <input
                    className="w-full rounded-[16px] border border-[var(--invite-line)] bg-transparent px-5 py-4 text-lg text-[var(--invite-brown)] outline-none transition focus:border-[var(--invite-gold)] focus:bg-[var(--invite-paper)]"
                    placeholder="Seu nome completo"
                    {...register("guest_name")}
                  />
                  {errors.guest_name ? (
                    <p className="mt-2 text-sm text-rose-600">{errors.guest_name.message}</p>
                  ) : null}
                </div>

                <div className="sm:col-span-2">
                  <label className="mb-2 flex items-center gap-2 font-body text-xl text-[var(--invite-brown-soft)]">
                    <Phone className="size-4" />
                    Celular / WhatsApp <span className="text-rose-400">*</span>
                  </label>
                  <input
                    className="w-full rounded-[16px] border border-[var(--invite-line)] bg-transparent px-5 py-4 text-lg text-[var(--invite-brown)] outline-none transition focus:border-[var(--invite-gold)] focus:bg-[var(--invite-paper)]"
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
                <h3 className="font-heading text-2xl text-[var(--invite-brown)] sm:text-3xl">Participação</h3>
                <hr className="mt-3 border-[var(--invite-line)]" />
              </div>
              <div className="rounded-[20px] bg-[var(--invite-sage-soft)]/30 p-6">
                <p className="mb-4 font-body text-xl text-[var(--invite-brown-soft)]">
                  Você poderá comparecer?
                </p>
                <div className="flex flex-wrap gap-4">
                  <label className="cursor-pointer">
                    <input className="peer sr-only" type="radio" value="attending" {...register("attendance_status")} />
                    <span className="flex min-w-[100px] items-center justify-center rounded-[14px] border border-transparent bg-transparent px-6 py-3 font-heading text-xl text-[var(--invite-brown)] transition hover:bg-[var(--invite-sage-soft)]/50 peer-checked:border-[var(--invite-emerald)] peer-checked:bg-[var(--invite-sage-soft)] peer-checked:shadow-sm">
                      Sim!
                    </span>
                  </label>
                  <label className="cursor-pointer">
                    <input className="peer sr-only" type="radio" value="not-attending" {...register("attendance_status")} />
                    <span className="flex min-w-[100px] items-center justify-center rounded-[14px] border border-[var(--invite-line)] bg-transparent px-6 py-3 font-heading text-xl text-[var(--invite-brown)] transition hover:bg-[var(--invite-paper)] peer-checked:bg-[var(--invite-paper)] peer-checked:shadow-sm">
                      Não
                    </span>
                  </label>
                </div>
              </div>
            </div>

            {/* ACOMPANHANTES */}
            {attendanceStatus === "attending" && (
              <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                <div className="mb-6">
                  <h3 className="font-heading text-2xl text-[var(--invite-brown)] sm:text-3xl">Acompanhantes</h3>
                  <hr className="mt-3 border-[var(--invite-line)]" />
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="mb-2 flex items-center gap-2 font-body text-xl text-[var(--invite-brown-soft)]">
                      <Users className="size-4" />
                      Número de acompanhantes
                    </label>
                    <select
                      className="w-full rounded-[16px] border border-[var(--invite-line)] bg-transparent px-5 py-4 text-lg text-[var(--invite-brown)] outline-none transition focus:border-[var(--invite-gold)] focus:bg-[var(--invite-paper)]"
                      {...register("companions_count")}
                    >
                      {Array.from({ length: 9 }, (_, number) => (
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
                          <label className="mb-2 flex items-center gap-2 font-body text-lg text-[var(--invite-brown-soft)]">
                            <User className="size-4" />
                            Acompanhante {index + 1}
                          </label>
                          <input
                            className="w-full rounded-[16px] border border-[var(--invite-line)] bg-transparent px-5 py-4 text-lg text-[var(--invite-brown)] outline-none transition focus:border-[var(--invite-gold)] focus:bg-[var(--invite-paper)]"
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
                <h3 className="flex items-center gap-2 font-heading text-2xl text-[var(--invite-brown)] sm:text-3xl">
                  Deixe um recado
                </h3>
                <hr className="mt-3 border-[var(--invite-line)]" />
              </div>
              <div>
                <textarea
                  className="min-h-32 w-full rounded-[16px] border border-[var(--invite-line)] bg-transparent px-5 py-4 text-lg text-[var(--invite-brown)] outline-none transition focus:border-[var(--invite-gold)] focus:bg-[var(--invite-paper)]"
                  placeholder="Se desejar, escreva um recado carinhoso para a formanda."
                  {...register("notes")}
                />
                {errors.notes ? (
                  <p className="mt-2 text-sm text-rose-600">{errors.notes.message}</p>
                ) : null}
              </div>
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


      </div>
    </section>
  );
}
