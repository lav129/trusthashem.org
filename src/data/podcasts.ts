export type Podcast = {
  title: string;
  href: string;
  blurb: string;
  tag?: "Women's Group" | "Classic" | "Festivals" | "Faith";
  image?: string;
};

export const podcasts: Podcast[] = [
  {
    title: "The POWER of the Festivals — HaGaon HaRav Yaakov Hillel Shlita",
    href: "https://jewishpodcasts.fm/festivals",
    blurb: "Discover the inner light of the Jewish calendar with HaGaon HaRav Yaakov Hillel.",
    tag: "Festivals",
    image: "/images/The-POWER-of-the-Festivals-Womens-Learning-Group.jpeg",
  },
  {
    title: "Your Soul",
    href: "https://jewishpodcasts.fm/yoursoul",
    blurb: "A journey into the depths of the soul — knowing who you truly are.",
    tag: "Faith",
    image: "/images/photo-light.jpg",
  },
  {
    title: "Laws of Lashon Hara",
    href: "https://jewishpodcasts.fm/lashonhara",
    blurb: "Practical guidance for guarding speech and elevating relationships.",
    tag: "Classic",
    image: "/images/photo-books.jpg",
  },
  {
    title: "The Pele Yoetz — Rabbi Eliezer Papo",
    href: "https://jewishpodcasts.fm/peleyoetz",
    blurb: "Giving meaning to Jewish life through the timeless wisdom of the Pele Yoetz.",
    tag: "Classic",
    image: "/images/The-Pele-Yoetz-Giving-Meaning-to-Jewish-Life-WOMENS-GROUP.jpeg",
  },
  {
    title: "Pirkei Avot (Ethics of Our Fathers)",
    href: "https://jewishpodcasts.fm/pirkeiavot",
    blurb: "Ethics, character, and living with integrity — one mishnah at a time.",
    tag: "Classic",
    image: "/images/Pirkei-Avot-Ethics-of-Our-Fathers-Womens-Learning-Group.jpeg",
  },
  {
    title: "Roni Akarah — Guide for the Childless",
    href: "https://jewishpodcasts.fm/havingchildren",
    blurb: "Comfort, strength, and hope for those walking a tender path.",
    tag: "Faith",
    image: "/images/photo-hands.jpg",
  },
  {
    title: "Book of Psalms — A Deep Look Inside Each Tehillim",
    href: "https://jewishpodcasts.fm/tehillim",
    blurb: "Enter the heart of Dovid HaMelech’s words of prayer and trust.",
    tag: "Faith",
    image: "/images/photo-sky.jpg",
  },
  {
    title: "Secrets of Redemption — Ma’amar HaGeulah — RaMChaL",
    href: "https://jewishpodcasts.fm/hageulah",
    blurb: "RaMChaL’s teachings on geulah and the unfolding of Hashem’s plan.",
    tag: "Classic",
    image: "/images/Secrets-of-Redemption-Maamar-HaGeulah-RaMCHaL-Womens-Learning-Group.jpeg",
  },
  {
    title: "Getting to Know Yourself — Da Es Atzmecha",
    href: "https://jewishpodcasts.fm/knowyourself",
    blurb: "Self-knowledge as a gateway to serving Hashem with clarity.",
    tag: "Faith",
    image: "/images/photo-light.jpg",
  },
  {
    title: "Shaar Habitachon",
    href: "https://jewishpodcasts.fm/bitachon",
    blurb: "The Gate of Trust — live with quiet confidence in Hashem’s care.",
    tag: "Faith",
    image: "/images/gateway.webp",
  },
  {
    title: "The Path of the Just — RaMCHal — Mesillat Yesharim",
    href: "https://jewishpodcasts.fm/ramchal",
    blurb: "A step-by-step path toward holiness and refined character.",
    tag: "Classic",
    image: "/images/ranhal.jpeg",
  },
  {
    title: "The 10 Gates of Chovos HaLevavos",
    href: "https://jewishpodcasts.fm/10_gates",
    blurb: "Duties of the Heart — ten gates into inner devotion.",
    tag: "Classic",
    image: "/images/The-10-Gates-of-Chovos-HaLevavos-Womens-Learning-Group.jpeg",
  },
  {
    title: "Gateways to Hashem",
    href: "https://jewishpodcasts.fm/gatewaystohashem",
    blurb: "Open doors of closeness, prayer, and living presence.",
    tag: "Faith",
    image: "/images/gateway.webp",
  },
  {
    title: "The 13 Principles of Faith",
    href: "https://jewishpodcasts.fm/the13principles",
    blurb: "Rambam’s foundations of Emunah, taught with clarity and heart.",
    tag: "Faith",
    image: "/images/gods-plan.jpeg",
  },
  {
    title: "Shidduchim — Mine or Hashems? Rav Chaim Kanievsky on Shidduchim",
    href: "https://jewishpodcasts.fm/shidduchim",
    blurb: "Guidance and bitachon for the journey toward marriage.",
    tag: "Faith",
    image: "/images/shidduchim.webp",
  },
  {
    title: "TRUE Ahavas Yisrael — Beis HaLevi — WOMEN'S LEARNING GROUP",
    href: "https://jewishpodcasts.fm/ahavasyisrael",
    blurb: "Love for every Jew, rooted in the Beis HaLevi’s teachings.",
    tag: "Women's Group",
    image: "/images/ahavat-israel.webp",
  },
  {
    title: "Understanding YOUR Tefillah — “What are YOU really saying?” — WOMEN'S GROUP",
    href: "https://jewishpodcasts.fm/knowwhatyousaytefillah",
    blurb: "Bring depth and intention to the words of prayer.",
    tag: "Women's Group",
    image: "/images/shma2.jpeg",
  },
  {
    title: "Knowing G-d's Plan — RaMCHaL Da'as Tevunos — WOMEN'S GROUP",
    href: "https://jewishpodcasts.fm/knowinggdsplanramchal",
    blurb: "See the Divine plan with wisdom from Da’as Tevunos.",
    tag: "Women's Group",
    image: "/images/gods-plan.jpeg",
  },
  {
    title: "Building A Sanctuary in The Heart — WOMEN'S GROUP",
    href: "https://jewishpodcasts.fm/trusthashem",
    blurb: "Make the heart a Mishkan — a dwelling place for Hashem.",
    tag: "Women's Group",
    image: "/images/meeting-with-hashem.jpeg",
  },
  {
    title: "THE Tomer Devorah",
    href: "https://jewishpodcasts.fm/thetomerdevorah",
    blurb: "Emulate Hashem’s thirteen attributes of mercy.",
    tag: "Classic",
    image: "/images/THE-Tomer-Devorah-Womens-Learning-Group.webp",
  },
  {
    title: "Yonah — The Journey of the Soul",
    href: "https://jewishpodcasts.fm/yonah-thejourneyofthesoul",
    blurb: "The story of Yonah as a map of the soul’s return.",
    tag: "Classic",
    image: "/images/Yonah-Journey-of-the-Soul-Womens-Learning-Group-.jpeg",
  },
];
