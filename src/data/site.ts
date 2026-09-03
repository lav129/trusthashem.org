import content from "./content.json";

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
  { href: "/audio/", label: "Audio" },
  { href: "/videos/", label: "Videos" },
  { href: "/articles/", label: "Teachings" },
  { href: "/who-we-are/", label: "About" },
  { href: "/contact-us/", label: "Contact" },
  { href: "/donate/", label: "Donate" },
];

export const moreNav = [
  { href: "/emunah/", label: "Emunah" },
  { href: "/bitachon/", label: "Bitachon" },
  { href: "/articles/", label: "Teachings" },
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

export { content };
export const lessons = content.lessons;
export const homeTracks = content.homeTracks;
