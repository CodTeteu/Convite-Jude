import { EVENT_SLUG } from "@shared/constants";

export const inviteData = {
  site: {
    title: "Camilla Santana Conegundes | Formatura em Medicina",
    description:
      "Convite digital de formatura de Camilla Santana Conegundes.",
    domain: "camilla.lumaconvites.com.br",
  },
  graduate: {
    firstName: "Camilla",
    lastName: "Santana Conegundes",
    fullName: "Camilla Santana Conegundes",
    course: "Medicina",
    signatureQuote:
      "A medicina me ensinou que, por trás de cada diagnóstico, existe uma história que merece cuidado, respeito e humanidade.",
  },
  event: {
    label: "Evento único",
    dateText: "18/07/2026",
    dateLong: "18 de julho de 2026",
    timeText: "22h",
    startsAt: "2026-07-18T22:00:00-03:00",
    endsAt: "2026-07-19T03:00:00-03:00",
    venue: "Av. Heráclito Mourão de Miranda, 1340 - Castelo, Belo Horizonte - MG, 31330-142",
    venueName: "Castelo, Belo Horizonte/MG",
    mapsUrl: "https://maps.app.goo.gl/nysEJNSkwN6RpTbh6?g_st=ic",
    dressCode: "Traje passeio completo",
    confirmationDeadline: "17/07/2026",
  },
  navigation: [
    { label: "Minha jornada", href: "#jornada" },
    { label: "Família", href: "#familia" },
    { label: "Celebração", href: "#celebracao" },
    { label: "RSVP", href: "#rsvp" },
  ],
  hero: {
    eyebrow: "Convite de Formatura",
    monogram: "CSC",
    name: "Camilla Santana",
    supportingName: "Conegundes",
    courseLine: "Medicina",
    metaLine: "18 de julho de 2026 • 22h • Belo Horizonte",
    primaryCta: "Confirmar presença",
    imageAsset: "camilla-portrait-smile",
  },
  journey: {
    label: "Minha jornada",
    title: "Minha Jornada",
    images: [
      {
        asset: "camilla-portrait-diploma",
        alt: "Camilla em retrato com diploma",
      },
      {
        asset: "camilla-portrait-soft",
        alt: "Camilla em retrato delicado de formatura",
      },
      {
        asset: "camilla-childhood",
        alt: "Camilla na infância",
      },
    ],
    paragraphs: [
      "Com imensa gratidão e alegria, compartilho a realização de um dos maiores sonhos da minha vida: a formatura em Medicina. Agradeço primeiramente a Deus e a Nossa Senhora, que guiaram meus passos com amor e luz, mesmo nos momentos mais desafiadores. Foi com fé que encontrei forças para seguir em frente e chegar até aqui.",
      "À minha família, meu porto seguro, deixo meu agradecimento mais profundo. Aos meus pais, Magda e Marco, e à minha irmã, Priscilla, que foram base e apoio incondicional ao longo de toda essa jornada: vocês tornaram esse sonho possível. Cada gesto, cada palavra de incentivo e cada sacrifício de vocês foi essencial para minha conquista.",
      "Agradeço também aos meus amigos e a toda minha família estendida, que, com carinho e presença, tornaram o caminho mais leve e me ofereceram apoio verdadeiro. Entre livros e jalecos, descobri que a medicina vai muito além de diagnósticos e tratamentos. Aprendi que cuidar é, antes de tudo, um ato de empatia e entrega.",
      "No voluntariado, vivi experiências transformadoras que me ensinaram o verdadeiro significado de ser médica. À Missão Amazônia, Expedição Pantanal e Expedição Sertões, e a todos os colegas e mestres envolvidos, meu muito obrigada por despertarem em mim um olhar mais humano e sensível à dor do outro. Durante minha formação, cada paciente foi um mestre.",
      "As histórias, os desafios e a confiança de cada um me ensinaram mais do que qualquer sala de aula poderia ensinar. Carrego comigo esse aprendizado com gratidão, respeito e responsabilidade. Foram anos de muitas lutas, renúncias e superações, mas também de crescimento, descobertas e conquistas. Hoje, com o coração repleto de emoção, me sinto realizada e pronta para seguir servindo com dedicação e amor.",
    ],
    quote:
      "A medicina, para mim, é um compromisso com a vida, com a escuta atenta, com o olhar cuidadoso.",
    quoteAuthor: "Camilla Santana Conegundes",
  },
  familyGallery: {
    label: "Minha base",
    title: "Família",
    description: "",
    paragraphs: [
      "Agradeço a Deus pela dádiva da família que me foi concedida — meu maior alicerce e o bem mais precioso da minha vida. À minha mãe, Magda, símbolo de garra, coragem e força, que, em cada passo da minha jornada, foi presença constante. Seu apoio incansável, sua fé inabalável em mim e seu cuidado diário foram os pilares que me sustentaram até aqui.",
      "Ao meu pai, Marco, que enfrentou inúmeras dificuldades sem jamais deixar meu sonho morrer. Ele foi o alicerce que abriu caminhos, acreditou em mim mesmo nos momentos mais difíceis e fez sacrifícios imensuráveis para tornar essa conquista possível. À minha irmã, Priscilla, meu equilíbrio, que caminhou comigo, trabalhou duro e me apoiou em cada fase, com amor e dedicação.",
      "Vocês três abriram mão de tanto, enfrentaram os dias difíceis ao meu lado e me levantaram quando eu quis desistir. Agradeço também ao meu avô Vitória, in memoriam, meu primeiro paciente, que sonhou comigo. Aos avós, tios, tias e primos, obrigada por todo carinho, apoio constante e palavras de incentivo. Minha vitória é de todos vocês.",
    ],
    slides: [
      {
        asset: "camilla-family-mother",
        alt: "Camilla e Magda em retrato afetuoso",
        caption: "Presença constante, força diária.",
        positionClass: "object-[center_15%]",
      },
      {
        asset: "camilla-family-group",
        alt: "Camilla com a família em retrato de grupo",
        caption: "A conquista celebrada em conjunto.",
        positionClass: "object-[center_10%]",
      },
      {
        asset: "camilla-family-core",
        alt: "Camilla com os pais e a irmã",
        caption: "Base, coragem e equilíbrio.",
        positionClass: "object-[center_20%]",
      },
      {
        asset: "camilla-family-wide",
        alt: "Camilla em retrato aberto com a família",
        caption: "Uma vitória construída em família.",
        positionClass: "object-[center_5%]",
      },
    ],
  },
  celebration: {
    label: "Venha celebrar comigo",
    title: "A Celebração",
    dateAccent: {
      day: "18",
      month: "Julho",
      time: "22h",
    },
    primaryImageAsset: "camilla-portrait-green",
    scheduleNarrative:
      "No dia 18 de julho de 2026, às 22:22, quero celebrar esse momento tão especial ao lado de quem fez parte da minha caminhada. Sua presença vai tornar esta noite ainda mais inesquecível.",
    locationNarrative:
      "Nos encontraremos em Belo Horizonte, em uma celebração única, pensada com carinho para receber cada convidado com acolhimento, beleza e gratidão.",
    quickNotes: [
      {
        title: "Chegue no horário",
        description:
          "A programação foi pensada para começar pontualmente às 22:22. Sua chegada no horário ajuda a preservar a experiência da noite.",
      },
      {
        title: "Traje",
        description:
          "Traje passeio completo para acompanhar o tom elegante e acolhedor desta noite.",
      },
      {
        title: "Confirmação",
        description:
          "RSVP até 17/07/2026. Evento único, sem cobrança, sem presentes e sem pagamento na confirmação.",
      },
    ],
  },
  rsvp: {
    label: "RSVP",
    title: "Confirme sua Presença",
    description: "",
    infoItems: [
      "Confirmação até 17/07/2026.",
    ],
    whatsappNumber: "31987430940",
    whatsappIntl: "5531987430940",
    successMessage:
      "Sua confirmação foi recebida com sucesso. Se desejar, você também pode continuar o contato pelo WhatsApp.",
  },
  footer: {
    name: "Camilla Santana Conegundes",
    closing:
      "Obrigada por fazer parte desta história. Será uma alegria celebrar esse capítulo com você.",
    brand: "Luma Convites Digitais",
    adminLabel: "Painel Admin",
  },
} as const;

export function buildWhatsAppMessage(params: {
  name: string;
  attendance: "attending" | "not-attending";
  companionsNames: string[];
}) {
  const attendanceLine =
    params.attendance === "attending"
      ? "Confirmo com carinho minha presença."
      : "Infelizmente não poderei estar presente, mas envio meu carinho e admiração por essa conquista.";

  const companionsLine =
    params.attendance === "attending" && params.companionsNames.length > 0
      ? `Acompanhantes: ${params.companionsNames.join(", ")}.`
      : "Sem acompanhantes.";

  return `Olá, Camilla! ${attendanceLine}

Nome: ${params.name}
${companionsLine}

Parabéns por essa conquista tão bonita. Será uma alegria acompanhar esse momento especial.`;
}

export const calendarEvent = {
  title: `${inviteData.graduate.fullName} | Formatura em Medicina`,
  details:
    "Celebração da formatura em Medicina de Camilla Santana Conegundes.",
  location: inviteData.event.venue,
  startDateTime: "20260719T012200Z",
  endDateTime: "20260719T060000Z",
};

export const defaultSource = "site";
export const eventSlug = EVENT_SLUG;
