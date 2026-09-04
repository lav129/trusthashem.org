export type Podcast = {
  title: string;
  href: string;
  blurb: string;
  slug: string;
  showId: number;
  tag?: "Women's Group" | "Classic" | "Festivals" | "Faith";
  image: string;
};

export type PodcastEpisode = {
  title: string;
  src: string;
};

export const podcasts: Podcast[] = [
  {
    slug: "festivals",
    title: "The POWER of the Festivals — HaGaon HaRav Yaakov Hillel Shlita",
    href: "https://jewishpodcasts.fm/festivals",
    showId: 886,
    blurb: "Discover the inner light of the Jewish calendar with HaGaon HaRav Yaakov Hillel.",
    tag: "Festivals",
    image: "/images/podcasts/festivals.jpg",
  },
  {
    slug: "yoursoul",
    title: "Your Soul",
    href: "https://jewishpodcasts.fm/yoursoul",
    showId: 885,
    blurb: "A journey into the depths of the soul — knowing who you truly are.",
    tag: "Faith",
    image: "/images/podcasts/yoursoul.jpg",
  },
  {
    slug: "lashonhara",
    title: "Laws of Lashon Hara",
    href: "https://jewishpodcasts.fm/lashonhara",
    showId: 884,
    blurb: "Practical guidance for guarding speech and elevating relationships.",
    tag: "Classic",
    image: "/images/podcasts/lashonhara.jpg",
  },
  {
    slug: "peleyoetz",
    title: "The Pele Yoetz — Rabbi Eliezer Papo",
    href: "https://jewishpodcasts.fm/peleyoetz",
    showId: 882,
    blurb: "Giving meaning to Jewish life through the timeless wisdom of the Pele Yoetz.",
    tag: "Classic",
    image: "/images/podcasts/peleyoetz.jpg",
  },
  {
    slug: "pirkeiavot",
    title: "Pirkei Avot (Ethics of Our Fathers)",
    href: "https://jewishpodcasts.fm/pirkeiavot",
    showId: 883,
    blurb: "Ethics, character, and living with integrity — one mishnah at a time.",
    tag: "Classic",
    image: "/images/podcasts/pirkeiavot.jpg",
  },
  {
    slug: "havingchildren",
    title: "Roni Akarah — Guide for the Childless",
    href: "https://jewishpodcasts.fm/havingchildren",
    showId: 881,
    blurb: "Comfort, strength, and hope for those walking a tender path.",
    tag: "Faith",
    image: "/images/podcasts/havingchildren.jpg",
  },
  {
    slug: "tehillim",
    title: "Book of Psalms — A Deep Look Inside Each Tehillim",
    href: "https://jewishpodcasts.fm/tehillim",
    showId: 880,
    blurb: "Enter the heart of Dovid HaMelech’s words of prayer and trust.",
    tag: "Faith",
    image: "/images/podcasts/tehillim.jpg",
  },
  {
    slug: "hageulah",
    title: "Secrets of Redemption — Ma’amar HaGeulah — RaMChaL",
    href: "https://jewishpodcasts.fm/hageulah",
    showId: 879,
    blurb: "RaMChaL’s teachings on geulah and the unfolding of Hashem’s plan.",
    tag: "Classic",
    image: "/images/podcasts/hageulah.jpg",
  },
  {
    slug: "knowyourself",
    title: "Getting to Know Yourself — Da Es Atzmecha",
    href: "https://jewishpodcasts.fm/knowyourself",
    showId: 878,
    blurb: "Self-knowledge as a gateway to serving Hashem with clarity.",
    tag: "Faith",
    image: "/images/podcasts/knowyourself.jpg",
  },
  {
    slug: "bitachon",
    title: "Shaar Habitachon",
    href: "https://jewishpodcasts.fm/bitachon",
    showId: 861,
    blurb: "The Gate of Trust — live with quiet confidence in Hashem’s care.",
    tag: "Faith",
    image: "/images/podcasts/bitachon.jpg",
  },
  {
    slug: "ramchal",
    title: "The Path of the Just — RaMCHal — Mesillat Yesharim",
    href: "https://jewishpodcasts.fm/ramchal",
    showId: 876,
    blurb: "A step-by-step path toward holiness and refined character.",
    tag: "Classic",
    image: "/images/podcasts/ramchal.jpg",
  },
  {
    slug: "10_gates",
    title: "The 10 Gates of Chovos HaLevavos",
    href: "https://jewishpodcasts.fm/10_gates",
    showId: 875,
    blurb: "Duties of the Heart — ten gates into inner devotion.",
    tag: "Classic",
    image: "/images/podcasts/10_gates.jpg",
  },
  {
    slug: "gatewaystohashem",
    title: "Gateways to Hashem",
    href: "https://jewishpodcasts.fm/gatewaystohashem",
    showId: 874,
    blurb: "Open doors of closeness, prayer, and living presence.",
    tag: "Faith",
    image: "/images/podcasts/gatewaystohashem.jpg",
  },
  {
    slug: "the13principles",
    title: "The 13 Principles of Faith",
    href: "https://jewishpodcasts.fm/the13principles",
    showId: 872,
    blurb: "Rambam’s foundations of Emunah, taught with clarity and heart.",
    tag: "Faith",
    image: "/images/podcasts/the13principles.jpg",
  },
  {
    slug: "shidduchim",
    title: "Shidduchim — Mine or Hashems? Rav Chaim Kanievsky on Shidduchim",
    href: "https://jewishpodcasts.fm/shidduchim",
    showId: 871,
    blurb: "Guidance and bitachon for the journey toward marriage.",
    tag: "Faith",
    image: "/images/podcasts/shidduchim.jpg",
  },
  {
    slug: "ahavasyisrael",
    title: "TRUE Ahavas Yisrael — Beis HaLevi — WOMEN'S LEARNING GROUP",
    href: "https://jewishpodcasts.fm/ahavasyisrael",
    showId: 666,
    blurb: "Love for every Jew, rooted in the Beis HaLevi’s teachings.",
    tag: "Women's Group",
    image: "/images/podcasts/ahavasyisrael.jpg",
  },
  {
    slug: "knowwhatyousaytefillah",
    title: "Understanding YOUR Tefillah — “What are YOU really saying?” — WOMEN'S GROUP",
    href: "https://jewishpodcasts.fm/knowwhatyousaytefillah",
    showId: 664,
    blurb: "Bring depth and intention to the words of prayer.",
    tag: "Women's Group",
    image: "/images/podcasts/knowwhatyousaytefillah.jpg",
  },
  {
    slug: "knowinggdsplanramchal",
    title: "Knowing G-d's Plan — RaMCHaL Da'as Tevunos — WOMEN'S GROUP",
    href: "https://jewishpodcasts.fm/knowinggdsplanramchal",
    showId: 662,
    blurb: "See the Divine plan with wisdom from Da’as Tevunos.",
    tag: "Women's Group",
    image: "/images/podcasts/knowinggdsplanramchal.jpg",
  },
  {
    slug: "trusthashem",
    title: "Building A Sanctuary in The Heart — WOMEN'S GROUP",
    href: "https://jewishpodcasts.fm/trusthashem",
    showId: 660,
    blurb: "Make the heart a Mishkan — a dwelling place for Hashem.",
    tag: "Women's Group",
    image: "/images/podcasts/trusthashem.jpg",
  },
  {
    slug: "thetomerdevorah",
    title: "THE Tomer Devorah",
    href: "https://jewishpodcasts.fm/thetomerdevorah",
    showId: 873,
    blurb: "Emulate Hashem’s thirteen attributes of mercy.",
    tag: "Classic",
    image: "/images/podcasts/thetomerdevorah.jpg",
  },
  {
    slug: "yonah-thejourneyofthesoul",
    title: "Yonah — The Journey of the Soul",
    href: "https://jewishpodcasts.fm/yonah-thejourneyofthesoul",
    showId: 877,
    blurb: "The story of Yonah as a map of the soul’s return.",
    tag: "Classic",
    image: "/images/podcasts/yonah-thejourneyofthesoul.jpg",
  },
];

/** Normalize enclosure URLs so they stream from records CDN. */
export function podcastAudioUrl(url: string) {
  return url
    .replace("https://jewishpodcasts.fm/protected/", "https://records.jewishpodcasts.fm/protected/")
    .replace("https://s3.jewishpodcasts.fm/protected/", "https://records.jewishpodcasts.fm/protected/");
}

export async function fetchPodcastEpisodes(showId: number, limit = 6): Promise<PodcastEpisode[]> {
  try {
    const res = await fetch(`https://rss.jewishpodcasts.fm/rss/${showId}`, {
      headers: { Accept: "application/rss+xml, application/xml, text/xml" },
    });
    if (!res.ok) return [];
    const xml = await res.text();
    const items = [...xml.matchAll(/<item>([\s\S]*?)<\/item>/gi)].slice(0, limit);
    return items
      .map((match) => {
        const block = match[1];
        const titleMatch =
          block.match(/<title><!\[CDATA\[([\s\S]*?)\]\]><\/title>/i) ||
          block.match(/<title>([\s\S]*?)<\/title>/i);
        const encMatch =
          block.match(/url="(https?:\/\/[^"]+\.mp3[^"]*)"/i) ||
          block.match(/<(?:media:)?content[^>]+url="(https?:\/\/[^"]+\.mp3[^"]*)"/i);
        const title = (titleMatch?.[1] || "Episode").replace(/<[^>]+>/g, "").trim();
        const src = encMatch?.[1] ? podcastAudioUrl(encMatch[1]) : "";
        return src ? { title, src } : null;
      })
      .filter((ep): ep is PodcastEpisode => Boolean(ep));
  } catch {
    return [];
  }
}
