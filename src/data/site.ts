import content from "./content.json";

export const mediaBase = "https://703cfe10ff531a.lhr.life";

export function mediaUrl(src = "") {
  return src.replace("https://trusthashem.org/wp-content", `${mediaBase}/wp-content`);
}

export const site = {
  name: "Trust Hashem",
  hebrew: "בס״ד",
  url: "https://trusthashem.org",
  email: content.email,
  homeWhatsapp: content.homeWhatsapp,
  paypalButtonId: content.paypalButtonId,
  teacher: "Rebbetzin Leah Donner",
  place: "Geula, Jerusalem",
  webDream: "https://yourwebdream.com",
};

export const nav = [
  { href: "/", label: "Home" },
  { href: "/library/", label: "Library" },
  { href: "/podcasts/", label: "Podcasts" },
  { href: "/audio/", label: "Audio" },
  { href: "/videos/", label: "Videos" },
  { href: "/mentorship/", label: "Mentorship" },
  { href: "/who-we-are/", label: "About" },
  { href: "/contact-us/", label: "Contact" },
  { href: "/donate/", label: "Donate" },
];

export const moreNav = [
  { href: "/emunah/", label: "Emunah" },
  { href: "/bitachon/", label: "Bitachon" },
  { href: "/articles/", label: "Teachings" },
  { href: "/podcasts/", label: "Podcasts" },
  { href: "/mentorship/", label: "Mentorship" },
  { href: "/videos/", label: "Videos" },
  { href: "/what-we-do/", label: "What We Do" },
  { href: "/why-trust-hashem/", label: "Why Trust Hashem" },
];

export const bitachonAttributes = [
  "Hashem has compassion. Only He knows what I need and has compassion for my needs.",
  "Hashem will not ignore my needs and will make sure they are tended to with all the powers that only He possesses.",
  "Hashem is strong and can provide my needs at any time, in any place.",
  "Hashem knows exactly what is needed, the best course of action, the best good, and when it should manifest.",
  "Hashem has known me since before I was created and therefore knows what is truly the best thing for me in the current moment and for future generations.",
  "I am completely in His hands and no one else has any external power over me besides Hashem.",
  "Hashem is exceedingly good and benevolent to me when I am worthy, and also when I am not worthy of His reciprocal kindness.",
];

export const homeIntro =
  "Experience a spiritual transformation with Bitachon — trust in Hashem. These lessons enter the teachings of Shaar Habitachon, the Beis HaLevi, Torah, and the sages, so a person can find solace, resilience, and the peace that comes from trusting in Hashem’s love and protection.";

export const teacherBio =
  "Presenting these lectures is Rebbetzin Leah Donner, who resides with her husband and family in Geula, Jerusalem, Israel. Inspired by her students and Rabbaim, she shares these teachings of Bitachon and Knowing Hashem Yisborach. Rebbetzin Donner received blessings from HaGaon HaRav Yacov Moshe Hillel, world-renowned Rosh Yeshiva of Ahavat Shalom in Jerusalem; Rabbi Israel Moshe Levinsohn, of whom the Beis Yisrael of Gur said this tzadik has the power of brachos; HaRav Yonason David, Rosh Kollel Pachad Yitzhak in HarNof; and HaGaon HaRav Itamar Schwartz, author of Bilvavi Mishkan Evneh, to teach Klal Yisrael with these wisdoms, shortly before the tragic events of Simchat Torah 5784. May Hashem continue to guide His nation towards greater strength, and through our dedication to learning Bitachon, may we merit the arrival of Mashiach in achdut with love and mercy.";

export const donationCopy = {
  title:
    "Create endless blessings—one mitzvah leads to another, building a world of kindness and light",
  lead: "Make a difference with just 1 shekel – add as much as your heart desires and help support our cause.",
  body: [
    "Your contribution helps us spread the wisdom of Torah and strengthen the faith of the Jewish people. Through our lessons and outreach, we inspire connection, learning, and spiritual growth.",
    "Every donation, no matter the size, allows us to continue providing free resources, Torah teachings, and programs that reach people across the world. Together, we can elevate the understanding of our traditions and bring light to those seeking guidance.",
    "Your generosity is deeply appreciated, and it makes a lasting impact. Thank you for your support.",
  ],
};

export const emunahSlugs = [
  "the-13-principles-of-faith",
  "knowing-gods-plan",
  "meeting-with-the-king-of-kings",
  "the-path-of-the-just",
  "understanding-shema-amidah-tefillah-what-are-you-really-saying",
  "the-pele-yoetz",
  "the-tomer-devorah",
];

export const bitachonSlugs = [
  "the-10-gates-of-chovos-halevavos",
  "gateways-to-hashem",
  "secrets-of-redemption",
  "yonah-journey-of-the-soul",
];

/** Prefer real podcast artwork over legacy screenshots. */
const lessonCoverBySlug: Record<string, string> = {
  "laws-of-lashon-hara": "/images/podcasts/lashonhara.jpg",
  "book-of-psalms": "/images/podcasts/tehillim.jpg",
  "ahavas-yisrael": "/images/podcasts/ahavasyisrael.jpg",
  "meeting-with-the-king-of-kings": "/images/podcasts/trusthashem.jpg",
  "understanding-shema-amidah-tefillah-what-are-you-really-saying":
    "/images/podcasts/knowwhatyousaytefillah.jpg",
  "knowing-gods-plan": "/images/podcasts/knowinggdsplanramchal.jpg",
  "the-path-of-the-just": "/images/podcasts/ramchal.jpg",
  "the-10-gates-of-chovos-halevavos": "/images/podcasts/10_gates.jpg",
  "yonah-journey-of-the-soul": "/images/podcasts/yonah-thejourneyofthesoul.jpg",
  "pirkei-avot-ethics-of-our-fathers": "/images/podcasts/pirkeiavot.jpg",
  "secrets-of-redemption": "/images/podcasts/hageulah.jpg",
  "the-pele-yoetz": "/images/podcasts/peleyoetz.jpg",
  "the-power-of-the-festivals": "/images/podcasts/festivals.jpg",
  "the-tomer-devorah": "/images/podcasts/thetomerdevorah.jpg",
  "roni-akarah-guide-for-the-childless": "/images/podcasts/havingchildren.jpg",
  "shidduchim-mine-or-hashems": "/images/podcasts/shidduchim.jpg",
  "gateways-to-hashem": "/images/podcasts/gatewaystohashem.jpg",
  "master-your-words-master-your-life": "/images/podcasts/lashonhara.jpg",
  "how-to-create-the-neshama-of-a-mitzvah-sefer-kaasher-tzivah-hashem":
    "/images/podcasts/bitachon.jpg",
  "the-13-principles-of-faith": "/images/podcasts/the13principles.jpg",
};

export { content };
export const lessons = (content.lessons || []).map((lesson: any) => ({
  ...lesson,
  image: lessonCoverBySlug[lesson.slug] || lesson.image,
  count: lesson.count || lesson.tracks?.length || 0,
}));
export const homeTracks = content.homeTracks;

export const featuredSeriesSlugs = [
  "the-10-gates-of-chovos-halevavos",
  "laws-of-lashon-hara",
  "book-of-psalms",
  "the-power-of-the-festivals",
];

export const featuredSeries = featuredSeriesSlugs
  .map((slug) => lessons.find((l: any) => l.slug === slug))
  .filter(Boolean);

export const audioTopics = [
  {
    id: "bitachon",
    title: "Bitachon & Trust",
    blurb: "Live with quiet confidence in Hashem’s care.",
    href: "/audio/#bitachon",
    slugs: bitachonSlugs,
  },
  {
    id: "emunah",
    title: "Emunah & Faith",
    blurb: "Foundations of belief and knowing Hashem.",
    href: "/audio/#emunah",
    slugs: emunahSlugs,
  },
  {
    id: "classic",
    title: "Classic Sefarim",
    blurb: "Mesillat Yesharim, Pele Yoetz, Pirkei Avot, and more.",
    href: "/audio/#classic",
    slugs: [
      "the-path-of-the-just",
      "the-pele-yoetz",
      "pirkei-avot-ethics-of-our-fathers",
      "the-tomer-devorah",
      "laws-of-lashon-hara",
      "master-your-words-master-your-life",
    ],
  },
  {
    id: "life",
    title: "Life & Relationships",
    blurb: "Shidduchim, family, speech, and daily living.",
    href: "/audio/#life",
    slugs: [
      "shidduchim-mine-or-hashems",
      "roni-akarah-guide-for-the-childless",
      "ahavas-yisrael",
      "how-to-create-the-neshama-of-a-mitzvah-sefer-kaasher-tzivah-hashem",
    ],
  },
  {
    id: "festivals",
    title: "Festivals & Prayer",
    blurb: "The Jewish year, Tehillim, and tefillah.",
    href: "/audio/#festivals",
    slugs: [
      "the-power-of-the-festivals",
      "book-of-psalms",
      "understanding-shema-amidah-tefillah-what-are-you-really-saying",
      "meeting-with-the-king-of-kings",
    ],
  },
];

export function lessonsBySlugs(slugs: string[]) {
  return slugs
    .map((slug) => lessons.find((l: any) => l.slug === slug))
    .filter(Boolean);
}
