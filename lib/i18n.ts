import type { LocaleValue } from "./sanity/types";

export const LOCALES = ["en", "fr"] as const;
export type Locale = (typeof LOCALES)[number];

/** Language that locale-less URLs open in (NEXT_PUBLIC_SITE_LOCALE, default "en" — the Studio's default language). */
export const DEFAULT_LOCALE: Locale = process.env.NEXT_PUBLIC_SITE_LOCALE === "fr" ? "fr" : "en";

export function isLocale(value: unknown): value is Locale {
  return typeof value === "string" && (LOCALES as readonly string[]).includes(value);
}

/** Reads a Sanity localeString/localeText in `locale`, falling back to the other language. */
export function t(field: LocaleValue, locale: Locale): string {
  if (!field) return "";
  return field[locale] || field.en || field.fr || "";
}

/** Prefixes an app path with the locale: ("fr", "/plans") → "/fr/plans", ("en", "/#plans") → "/en#plans". */
export function localePath(locale: Locale, path: string) {
  if (path === "/" || path === "") return `/${locale}`;
  if (path.startsWith("/#") || path.startsWith("/?")) return `/${locale}${path.slice(1)}`;
  return `/${locale}${path}`;
}

/**
 * Language that `x-default` and cross-language canonicals point to:
 * DEFAULT_LOCALE when the page exists in it, otherwise the first available one.
 */
export function preferredLocale(available: readonly Locale[]): Locale {
  return available.includes(DEFAULT_LOCALE) ? DEFAULT_LOCALE : (available[0] ?? DEFAULT_LOCALE);
}

/** Swaps the locale segment of a pathname (used by the language switcher). */
export function switchLocalePath(pathname: string, to: Locale) {
  const rest = pathname.replace(/^\/(en|fr)(?=\/|$)/, "");
  return `/${to}${rest}`;
}

const dictionary = {
  en: {
    nav: {
      home: "Home",
      about: "About",
      plans: "Plans",
      faq: "FAQ",
      blog: "Blog",
      contact: "Contact",
    },
    subscribeNow: "Subscribe Now",
    explorePlans: "Explore Plans",
    contactUs: "Contact Us",
    menu: "Menu",
    backToTop: "Back to top",
    hero: {
      badge: "Professional IPTV Service",
      title: "Experience a World of Entertainment Without Limits",
      desc: "Enjoy thousands of live channels, movies, and series in stunning quality, anytime and anywhere.",
      stats: [
        ["+10K", "Live Channels"],
        ["4K", "Picture Quality"],
        ["24/7", "Support"],
        ["99%", "Uptime"],
      ],
    },
    channelsLabel: "Channels included",
    alt: {
      hero: "IPTV Canada: live Canadian TV channels, sports and movies on a Smart TV",
      channel: "{name} logo – live TV channel on IPTV Canada",
      movie: "{name} poster – stream it with IPTV Canada",
      plan: "{name} – IPTV Canada subscription plan",
      post: "{name} – IPTV Canada blog",
      section: "{name} – IPTV Canada streaming service",
    },
    movies: {
      label: "Movies & Series",
      title: "Blockbusters and Hit Series",
      sub: "The latest films and the most popular series, ready to stream whenever you want.",
    },
    language: "Language",
    about: {
      label: "About Us",
      title: "An Entertainment Experience Like No Other",
      imageAlt: "IPTV Canada streaming service on Smart TV, phone and tablet",
    },
    features: {
      label: "Why Choose Us",
      title: "Everything You Need in One Subscription",
      sub: "Live TV, movies, sports and series in stunning quality, on every screen you own.",
      items: [
        { stat: "18,000+ Channels", title: "Live TV Channels", text: "Access thousands of international, national, news, documentary, and entertainment networks from the US, UK, Europe, Middle East, and worldwide." },
        { stat: "60,000+ VOD", title: "Movies & TV Series", text: "Binge the latest box-office premieres, trending series, and classic cinema on demand with multi-language subtitles and Dolby Surround sound." },
        { stat: "PPV & 60 FPS", title: "Live Sports", text: "Never miss a goal or knockout. Watch top football leagues, Formula 1, UFC PPV events, NBA, and NFL in smooth 60fps feeds." },
        { stat: "4K UHD / HEVC", title: "HD & 4K Streaming", text: "Powered by H.265 HEVC compression and adaptive bitrate streaming so you enjoy razor-sharp 4K, Full HD, and HD playback on any internet speed." },
        { stat: "All Platforms", title: "Multi-Device Compatibility", text: "Stream effortlessly across Samsung & LG Smart TVs, Amazon Firestick, Apple TV, Android boxes, iOS, Windows, Mac, and MAG portals." },
        { stat: "EPG + Catch-Up", title: "24/7 Entertainment", text: "Non-stop round-the-clock streaming complete with a real-time Electronic Program Guide (EPG), 7-day TV catch-up, and dedicated 24/7 assistance." },
      ],
    },
    plans: {
      label: "Plans",
      title: "Choose the Plan That Fits You",
      sub: "Enjoy the best streaming experience with flexible plans built around your needs.",
      bestSeller: "⭐ Best Seller",
      sold: "sold",
      save: "Save",
      showDetails: "Show details",
      hideDetails: "Hide details",
      prev: "Previous plans",
      next: "Next plans",
      empty: "Plans will be available soon.",
      oneTime: "One-time payment",
    },
    faq: {
      label: "FAQ",
      title: "Everything You Need to Know",
      empty: "No questions yet.",
    },
    blog: {
      label: "Blog",
      title: "News & Guides",
      readMore: "Read more →",
      empty: "No articles published yet.",
      back: "← Back to blog",
      prev: "← Newer",
      next: "Older →",
      by: "by",
    },
    order: {
      title: "Order this plan",
      sub: "Leave your details and we will contact you to activate your subscription.",
      fullname: "Full name",
      phone: "Phone",
      phoneCode: "Country code",
      email: "Email",
      submit: "Place order",
      sending: "Sending…",
      success: "Thank you! Your order was received. We will contact you shortly.",
      whatsapp: "Message us on WhatsApp",
      back: "← All plans",
    },
    contact: {
      label: "Contact",
      title: "Get in Touch",
      sub: "Questions about a plan or setup? Send us a message and we will reply quickly.",
      fullname: "Full name",
      phone: "Phone",
      phoneCode: "Country code",
      email: "Email",
      subject: "Subject",
      message: "Message",
      submit: "Send message",
      sending: "Sending…",
      success: "Thank you! Your message was sent.",
      whatsapp: "WhatsApp",
      emailLabel: "Email",
      facebook: "Facebook",
      address: "Address",
    },
    form: {
      required: "Please fill in all required fields.",
      invalidEmail: "Please enter a valid email address.",
      invalidPhone: "Please enter a valid phone number.",
      failed: "Something went wrong. Please try again or contact us on WhatsApp.",
    },
    footer: {
      quickLinks: "Quick Links",
      contact: "Contact Us",
      rights: "All rights reserved",
      tagline: "Unlimited Entertainment 🎬",
      sitemap: "Sitemap",
      policy: "Refund Policy",
      desc: "Premium IPTV with diverse content and effortless streaming on any screen.",
    },
    policy: {
      label: "Policy",
      title: "Delivery & Refund Policy",
      sub: "How you receive your subscription, the free trial, and how refunds work.",
      sections: [
        [
          "📩 Delivery",
          "IPTV Pro is a digital service: nothing is shipped. After your payment is confirmed, we send your activation code and setup instructions by email or WhatsApp. Delivery is free and usually takes a few minutes, at most 24 hours.",
        ],
        [
          "🎁 1-day free trial",
          "Before you buy, you can ask for a free 24-hour test so you can check the channels, picture quality and stability on your own devices. Contact us to request your trial.",
        ],
        [
          "💸 Refunds",
          "You can ask for a full refund within 6 days of your purchase. To request it, contact us by email or WhatsApp with your order details. Refunds are free and go back to your original payment method.",
        ],
        [
          "📞 Questions",
          "If anything is unclear, contact us and we will help you.",
        ],
      ],
    },
    sitemap: {
      label: "Sitemap",
      title: "Sitemap",
      sub: "Every page of our site in one place: plans, guides and help.",
      pages: "Pages",
      plans: "Plans",
      blog: "Blog articles",
      otherLanguage: "Available in French only",
      updated: "Updated",
    },
    notFound: {
      title: "Page not found",
      text: "The page you are looking for does not exist or was moved.",
      back: "Back to home",
    },
  },
  fr: {
    nav: {
      home: "Accueil",
      about: "À propos",
      plans: "Forfaits",
      faq: "FAQ",
      blog: "Blogue",
      contact: "Contact",
    },
    subscribeNow: "S'abonner",
    explorePlans: "Voir les forfaits",
    contactUs: "Nous joindre",
    menu: "Menu",
    backToTop: "Haut de page",
    hero: {
      badge: "Service IPTV professionnel",
      title: "Un monde de divertissement sans limites",
      desc: "Des milliers de chaînes en direct, de films et de séries en qualité exceptionnelle, partout et en tout temps.",
      stats: [
        ["+10K", "Chaînes en direct"],
        ["4K", "Qualité d'image"],
        ["24/7", "Soutien"],
        ["99%", "Disponibilité"],
      ],
    },
    channelsLabel: "Chaînes incluses",
    alt: {
      hero: "IPTV Canada : chaînes canadiennes en direct, sports et films sur Smart TV",
      channel: "Logo {name} – chaîne en direct sur IPTV Canada",
      movie: "Affiche {name} – à regarder sur IPTV Canada",
      plan: "{name} – forfait d'abonnement IPTV Canada",
      post: "{name} – blogue IPTV Canada",
      section: "{name} – service de diffusion IPTV Canada",
    },
    movies: {
      label: "Films et séries",
      title: "Superproductions et séries à succès",
      sub: "Les derniers films et les séries les plus populaires, prêts à regarder quand vous le voulez.",
    },
    language: "Langue",
    about: {
      label: "À propos",
      title: "Une expérience de divertissement unique",
      imageAlt: "Service IPTV Canada sur Smart TV, téléphone et tablette",
    },
    features: {
      label: "Pourquoi nous choisir",
      title: "Tout ce qu’il vous faut dans un seul abonnement",
      sub: "Télé en direct, films, sports et séries en qualité exceptionnelle, sur tous vos écrans.",
      items: [
        { stat: "18 000+ chaînes", title: "Chaînes de télé en direct", text: "Accédez à des milliers de chaînes internationales et nationales — nouvelles, documentaires et divertissement — des États-Unis, du Royaume-Uni, d’Europe, du Moyen-Orient et du monde entier." },
        { stat: "60 000+ VOD", title: "Films et séries", text: "Dévorez les dernières sorties en salle, les séries du moment et les classiques du cinéma sur demande, avec sous-titres multilingues et son Dolby Surround." },
        { stat: "PPV et 60 FPS", title: "Sports en direct", text: "Ne manquez aucun but ni aucun K.-O. Regardez les grands championnats de soccer, la Formule 1, les événements UFC à la carte, la NBA et la NFL en flux fluides à 60 i/s." },
        { stat: "4K UHD / HEVC", title: "Diffusion HD et 4K", text: "Grâce à la compression H.265 HEVC et au débit adaptatif, profitez d’une image 4K, Full HD et HD d’une netteté remarquable, quelle que soit votre connexion." },
        { stat: "Toutes plateformes", title: "Compatible multi-appareils", text: "Regardez sans effort sur les téléviseurs intelligents Samsung et LG, Amazon Firestick, Apple TV, boîtiers Android, iOS, Windows, Mac et portails MAG." },
        { stat: "EPG + rattrapage", title: "Divertissement 24 h/24, 7 j/7", text: "Du contenu en continu, jour et nuit, avec un guide électronique des programmes (EPG) en temps réel, la télé de rattrapage sur 7 jours et une assistance dédiée 24/7." },
      ],
    },
    plans: {
      label: "Forfaits",
      title: "Choisissez le forfait qui vous convient",
      sub: "Profitez de la meilleure expérience de diffusion avec des forfaits flexibles adaptés à vos besoins.",
      bestSeller: "⭐ Le plus populaire",
      sold: "vendus",
      save: "Économisez",
      showDetails: "Voir les détails",
      hideDetails: "Masquer les détails",
      prev: "Forfaits précédents",
      next: "Forfaits suivants",
      empty: "Les forfaits seront bientôt disponibles.",
      oneTime: "Paiement unique",
    },
    faq: {
      label: "FAQ",
      title: "Tout ce que vous devez savoir",
      empty: "Aucune question pour le moment.",
    },
    blog: {
      label: "Blogue",
      title: "Nouvelles et guides",
      readMore: "Lire la suite →",
      empty: "Aucun article publié pour le moment.",
      back: "← Retour au blogue",
      prev: "← Plus récents",
      next: "Plus anciens →",
      by: "par",
    },
    order: {
      title: "Commander ce forfait",
      sub: "Laissez vos coordonnées et nous vous contacterons pour activer votre abonnement.",
      fullname: "Nom complet",
      phone: "Téléphone",
      phoneCode: "Indicatif du pays",
      email: "Courriel",
      submit: "Passer la commande",
      sending: "Envoi…",
      success: "Merci! Votre commande a bien été reçue. Nous vous contacterons sous peu.",
      whatsapp: "Écrivez-nous sur WhatsApp",
      back: "← Tous les forfaits",
    },
    contact: {
      label: "Contact",
      title: "Nous joindre",
      sub: "Des questions sur un forfait ou l'installation? Écrivez-nous et nous vous répondrons rapidement.",
      fullname: "Nom complet",
      phone: "Téléphone",
      phoneCode: "Indicatif du pays",
      email: "Courriel",
      subject: "Sujet",
      message: "Message",
      submit: "Envoyer le message",
      sending: "Envoi…",
      success: "Merci! Votre message a été envoyé.",
      whatsapp: "WhatsApp",
      emailLabel: "Courriel",
      facebook: "Facebook",
      address: "Adresse",
    },
    form: {
      required: "Veuillez remplir tous les champs obligatoires.",
      invalidEmail: "Veuillez entrer une adresse courriel valide.",
      invalidPhone: "Veuillez entrer un numéro de téléphone valide.",
      failed: "Une erreur est survenue. Veuillez réessayer ou nous joindre sur WhatsApp.",
    },
    footer: {
      quickLinks: "Liens rapides",
      contact: "Nous joindre",
      rights: "Tous droits réservés",
      tagline: "Divertissement illimité 🎬",
      sitemap: "Plan du site",
      policy: "Politique de remboursement",
      desc: "IPTV haut de gamme avec un contenu varié et une diffusion simple sur tous vos écrans.",
    },
    policy: {
      label: "Politique",
      title: "Politique de livraison et de remboursement",
      sub: "Comment vous recevez votre abonnement, l'essai gratuit et le fonctionnement des remboursements.",
      sections: [
        [
          "📩 Livraison",
          "IPTV Pro est un service numérique : rien n'est expédié. Une fois votre paiement confirmé, nous vous envoyons votre code d'activation et les instructions d'installation par courriel ou WhatsApp. La livraison est gratuite et prend généralement quelques minutes, 24 heures au maximum.",
        ],
        [
          "🎁 Essai gratuit de 1 jour",
          "Avant d'acheter, vous pouvez demander un essai gratuit de 24 heures pour vérifier les chaînes, la qualité d'image et la stabilité sur vos propres appareils. Contactez-nous pour demander votre essai.",
        ],
        [
          "💸 Remboursements",
          "Vous pouvez demander un remboursement complet dans les 6 jours suivant votre achat. Pour ce faire, écrivez-nous par courriel ou WhatsApp avec les détails de votre commande. Le remboursement est gratuit et effectué sur votre mode de paiement d'origine.",
        ],
        [
          "📞 Questions",
          "Si quelque chose n'est pas clair, contactez-nous et nous vous aiderons.",
        ],
      ],
    },
    sitemap: {
      label: "Plan du site",
      title: "Plan du site",
      sub: "Toutes les pages de notre site au même endroit : forfaits, guides et aide.",
      pages: "Pages",
      plans: "Forfaits",
      blog: "Articles du blogue",
      otherLanguage: "Disponible en anglais seulement",
      updated: "Mis à jour",
    },
    notFound: {
      title: "Page introuvable",
      text: "La page que vous cherchez n'existe pas ou a été déplacée.",
      back: "Retour à l'accueil",
    },
  },
} as const;

type Widen<T> = T extends string ? string : T extends readonly (infer U)[] ? readonly Widen<U>[] : { [K in keyof T]: Widen<T[K]> };
export type Dict = Widen<(typeof dictionary)["en"]>;

export function getDict(locale: Locale): Dict {
  return dictionary[locale];
}

/** Fills an `alt` template from the dictionary, e.g. altText(ui.alt.movie, "Titanic"). */
export function altText(template: string, name: string) {
  return template.replaceAll("{name}", name);
}
