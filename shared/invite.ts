import { DEFAULT_EVENT_SLUG } from "./constants.js";
import type { FeatureFlags } from "./features.js";

export type EventType = "graduation" | "wedding";

export interface InviteConfig {
  eventType: EventType;
  identity: {
    slug: string;
    title: string;
    description: string;
    domain: string;
  };
  features: FeatureFlags;
  people: {
    primaryFirstName: string;
    primaryFullName: string;
    secondaryFirstName?: string;
    secondaryFullName?: string;
    courseOrSubtitle: string;
    monogram: string;
    signatureQuote: string;
  };
  event: {
    label: string;
    dateText: string;
    dateLong: string;
    timeText: string;
    startsAt: string;
    endsAt: string;
    venue: string;
    venueName: string;
    venueImageAsset: string;
    mapsUrl: string;
    wazeUrl: string;
    dressCode: string;
    confirmationDeadline: string;
  };
  navigation: Array<{ label: string; href: string }>;
  hero: {
    eyebrow: string;
    name: string;
    supportingName: string;
    courseLine: string;
    metaLine: string;
    primaryCta: string;
    imageAsset: string;
  };
  story: {
    label: string;
    title: string;
    images: Array<{ asset: string; alt: string }>;
    paragraphs: string[];
    quote: string;
    quoteAuthor: string;
  };
  gallery: {
    label: string;
    title: string;
    description: string;
    paragraphs: string[];
    slides: Array<{
      asset: string;
      alt: string;
      caption: string;
      positionClass?: string;
      aspect?: "portrait" | "landscape";
    }>;
  };
  celebration: {
    label: string;
    title: string;
    dateAccent: { day: string; month: string; time: string };
    primaryImageAsset: string;
    scheduleNarrative: string;
    locationNarrative: string;
    quickNotes: Array<{ title: string; description: string }>;
  };
  rsvp: {
    label: string;
    title: string;
    description: string;
    infoItems: string[];
    maxCompanions: number;
    whatsappNumber: string;
    whatsappIntl: string;
    openWhatsAppAfterSubmit: boolean;
    successMessage: string;
    messagePlaceholder: string;
  };
  giftList: {
    enabled: boolean;
    title: string;
    description: string;
    pixKey: string;
    pixName: string;
    instructions: string;
  };
  menu: {
    enabled: boolean;
    label: string;
    title: string;
    description: string;
    courses: Array<{ category: string; items: string[] }>;
  };
  footer: {
    name: string;
    closing: string;
    brand: string;
    adminLabel: string;
  };
  theme: {
    style: string;
    primaryColor: string;
  };
}

export const inviteConfig: InviteConfig = {
  eventType: "graduation",
  identity: {
    slug: DEFAULT_EVENT_SLUG,
    title: "Joana Darc | Formatura Psicologia",
    description: "Convite digital da formatura de Joana Darc Bezerra da Silva — Psicologia.",
    domain: "joana.lumaconvites.com.br",
  },
  features: {
    rsvp: true,
    admin: true,
    giftList: false,
    music: false,
    gallery: true,
    countdown: true,
    dressCode: true,
  },
  people: {
    primaryFirstName: "Joana",
    primaryFullName: "Joana Darc Bezerra da Silva",
    courseOrSubtitle: "Psicologia",
    monogram: "JD",
    signatureQuote:
      "\u201cPara que todos vejam, e saibam, e considerem, e juntamente entendam que a mão do Senhor fez isto.\u201d — Isaías 41:20",
  },
  event: {
    label: "Jantar de Celebração",
    dateText: "08/08/2026",
    dateLong: "8 de agosto de 2026",
    timeText: "19h30",
    startsAt: "2026-08-08T19:30:00-03:00",
    endsAt: "2026-08-09T02:00:00-03:00",
    venue: "Salão Social da IAD Matriz Gurupi",
    venueName: "Salão Social da IAD Matriz",
    venueImageAsset: "hero/dinner.png",
    mapsUrl: "https://maps.app.goo.gl/Rkd1TThPWxNs8UmB6",
    wazeUrl: "https://waze.com/ul?ll=-11.7279,-49.0687&navigate=yes",
    dressCode: "Traje social",
    confirmationDeadline: "20/07/2026",
  },
  navigation: [
    { label: "História", href: "#jornada" },
    { label: "Galeria", href: "#familia" },
    { label: "Evento", href: "#celebracao" },
    { label: "RSVP", href: "#rsvp" },
  ],
  hero: {
    eyebrow: "Convite de Formatura",
    name: "Joana Darc",
    supportingName: "Bezerra da Silva",
    courseLine: "Psicologia",
    metaLine: "8 de agosto de 2026 • 19h30",
    primaryCta: "Confirmar presença",
    imageAsset: "hero/portrait.jpg",
  },
  story: {
    label: "Minha jornada",
    title: "Minha História",
    images: [
      { asset: "gallery/photo-1.jpg", alt: "Joana no consultório de Psicologia" },
      { asset: "gallery/photo-2.jpg", alt: "Joana com os livros de Psicologia" },
    ],
    paragraphs: [
      "Filha de pessoas simples, fui criada aprendendo que o verdadeiro valor da vida não está no que possuímos, mas naquilo que carregamos em nosso caráter. Aos meus pais, Hildeblande e Raimunda, devo muito do que sou.",
      "Com seus exemplos de honestidade, fé, humildade e amor, ensinaram-me que a maior riqueza da vida está nos valores que cultivamos. Foi observando sua força, sua dedicação e sua confiança em Deus que aprendi a sonhar sem perder minhas raízes e a acreditar que, com perseverança, honestidade e fidelidade a Deus, podemos chegar mais longe do que imaginamos.",
      "Cada conquista que celebro hoje carrega as marcas do suor, da renúncia e do amor deles. Esta formatura não representa apenas a conclusão de um curso, mas o fruto de uma história construída por mãos trabalhadoras, por joelhos dobrados em oração e por corações que nunca desistiram de acreditar.",
      "Desde criança, fui aquela que gostava de ouvir, acolher e caminhar ao lado das pessoas. Com o passar dos anos, compreendi que aquilo que parecia apenas uma característica da minha personalidade era, na verdade, um propósito. Por isso, a Psicologia nunca foi apenas uma profissão para mim, mas uma missão.",
      "Hoje, celebro não apenas a conquista de um diploma, mas a fidelidade de Deus em cada etapa da minha caminhada.",
    ],
    quote:
      "\u201cPara que todos vejam, e saibam, e considerem, e juntamente entendam que a mão do Senhor fez isto.\u201d",
    quoteAuthor: "Isaías 41:20",
  },
  gallery: {
    label: "Família",
    title: "A Base de Tudo",
    description: "Momentos especiais com quem esteve ao meu lado nesta jornada.",
    paragraphs: [
      "A meus pais, Hildeblande e Raimunda, que me ensinaram os valores que carrego. Cada passo dado até aqui foi sustentado pelo amor, pela oração e pela fé que vocês plantaram em mim.",
      "Gratidão a cada familiar e amigo que fez parte dessa caminhada.",
    ],
    slides: [
      { asset: "gallery/photo-3.jpg", alt: "Joana com os pais no dia da formatura", caption: "Minha base, minha fortaleza." },
      { asset: "gallery/photo-4.jpg", alt: "Joana com os pais segurando o diploma", caption: "O diploma é nosso!", aspect: "landscape" },
      { asset: "gallery/photo-5.jpg", alt: "Joana com família e amigos", caption: "Juntos em cada conquista.", aspect: "landscape" },
      { asset: "gallery/photo-6.jpg", alt: "Joana celebrando com o pai", caption: "Orgulho de pai." },
      { asset: "gallery/photo-7.jpg", alt: "Joana com a bíblia e o diploma", caption: "Fé e conquista caminham juntas." },
      { asset: "gallery/photo-8.jpg", alt: "Joana com a estola de Psicologia", caption: "Uma jornada de dedicação." },
      { asset: "gallery/photo-9.jpg", alt: "Joana com o capelo de formatura", caption: "O futuro é agora!", aspect: "landscape" },
    ],
  },
  celebration: {
    label: "Celebração",
    title: "Os Eventos",
    dateAccent: { day: "08", month: "Agosto", time: "19h30" },
    primaryImageAsset: "hero/venue.jpg",
    scheduleNarrative:
      "A Colação de Grau será no dia 7 de agosto de 2026, no Espaço Palaciu's Real Eventos. No dia seguinte, 8 de agosto, celebraremos com um jantar especial às 19h30.",
    locationNarrative:
      "O Jantar de Celebração será no Salão Social da IAD Matriz Gurupi.",
    quickNotes: [
      { title: "Colação de Grau", description: "7 de agosto de 2026 — Espaço Palaciu's Real Eventos." },
      { title: "Jantar de Celebração", description: "8 de agosto de 2026 às 19h30 — Salão Social da IAD Matriz Gurupi." },
      { title: "Traje", description: "Traje social." },
      { title: "Confirmação", description: "Confirme sua presença até 20/07/2026." },
      { title: "Estacionamento", description: "Estacionamento disponível no local." },
      { title: "Fotos", description: "Amamos fotos! Registre cada momento e compartilhe conosco!" },
      { title: "Bingo Especial", description: "Teremos um bingo especial durante o jantar! Cartelas a R$10 — adquira a sua no dia do evento e divirta-se contribuindo para este momento especial." },
    ],
  },
  rsvp: {
    label: "RSVP",
    title: "Confirme sua Presença",
    description:
      "Sua confirmação é essencial para que possamos preparar tudo com carinho para este momento tão especial.",
    infoItems: [
      "Confirme sua presença até 20/07/2026.",
      "Chegue no horário — início às 19h30.",
      "Traje social.",
      "Teremos um bingo especial durante o jantar! Cartelas a R$10 — adquira a sua no dia do evento.",
    ],
    maxCompanions: 4,
    whatsappNumber: "63991084042",
    whatsappIntl: "5563991084042",
    openWhatsAppAfterSubmit: true,
    successMessage: "Sua confirmação foi recebida com sucesso!",
    messagePlaceholder: "Se desejar, escreva uma mensagem especial para a Joana.",
  },
  giftList: {
    enabled: false,
    title: "Contribuição",
    description:
      "Se desejar contribuir, o valor vai diretamente para a formanda. Toda contribuição é muito bem-vinda!",
    pixKey: "06961229360",
    pixName: "Joana Darc Bezerra da Silva (Banco Sicoob)",
    instructions:
      "Faça o PIX usando a chave CPF abaixo. Após o envio, o presente ficará pendente até conferência manual.",
  },
  menu: {
    enabled: true,
    label: "Cardápio",
    title: "O que vamos saborear",
    description: "Preparamos um cardápio especial para celebrar esta noite com você.",
    courses: [
      { category: "Entrada", items: ["Salgados fritos"] },
      { category: "Prato Principal", items: ["Churrasco", "Feijão tropeiro", "Mandioca", "Salada tropical"] },
      { category: "Sobremesa", items: ["Bolo", "Doces finos"] },
    ],
  },
  footer: {
    name: "Joana Darc",
    closing: "Obrigada por fazer parte desta história.",
    brand: "Luma Convites Digitais",
    adminLabel: "Painel Admin",
  },
  theme: {
    style: "navy-gold",
    primaryColor: "#0D2747",
  },
};

export const defaultSource = "site";
export const eventSlug = inviteConfig.identity.slug;

