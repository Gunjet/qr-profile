// Adds (or refreshes) a fictional demo restaurant with a full menu.
// Usage: npm run db:seed-demo     → profile at /p/demo-menu
import pg from "pg";

const url = process.env.DATABASE_URL_UNPOOLED || process.env.DATABASE_URL;
if (!url) {
  console.error("DATABASE_URL_UNPOOLED / DATABASE_URL is not set");
  process.exit(1);
}

// Free-to-use food photos (Unsplash License). Fetched at seed time and stored
// as small data URLs, like photos uploaded through the menu editor.
const UNSPLASH = (id) => `https://images.unsplash.com/photo-${id}?w=480&h=480&fit=crop&q=70&fm=jpg`;
const PHOTOS = {
  tsuivan: "1585032226651-759b368d7246",
  buuz: "1563245372-f21724e3856d",
  khuushuur: "1534422298391-e4f8c172dddb",
  soup: "1617093727343-374698b1b08d",
  shorlog: "1555939594-58d7cb561ad1",
  ribs: "1544025162-d76694265947",
  greenSalad: "1512621776951-a57141f2eefd",
  beefSalad: "1546069901-ba9599a7e63c",
  cake: "1571877227200-a0d98ea607e9",
  icecream: "1551024506-0bccd828d307",
  tea: "1576092768241-dec231879fc3",
  juice: "1556679343-c7306c1976bc",
  latte: "1561047029-3000c68339ca",
  water: "1548839140-29a749e1cf4d",
};

async function photo(key) {
  if (!key) return "";
  try {
    const res = await fetch(UNSPLASH(PHOTOS[key]));
    if (!res.ok) throw new Error(String(res.status));
    return `data:image/jpeg;base64,${Buffer.from(await res.arrayBuffer()).toString("base64")}`;
  } catch (e) {
    console.warn(`photo ${key} skipped: ${e.message}`);
    return "";
  }
}

const item = async (name, price, description = "", photoKey) => ({
  name,
  price,
  description,
  photo: await photo(photoKey),
});

// Demo logo: a ger emblem, stored as an SVG data URL like an uploaded logo.
const LOGO_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120">
  <circle cx="60" cy="60" r="58" fill="#3d2614"/>
  <circle cx="60" cy="60" r="51" fill="none" stroke="#e9c27f" stroke-width="1.5"/>
  <circle cx="60" cy="38" r="3.2" fill="#e9c27f"/>
  <path d="M28 62 Q60 34 92 62 Z" fill="#e9c27f"/>
  <rect x="33" y="62" width="54" height="22" fill="#e9c27f"/>
  <path d="M37 66 L49 81 M49 66 L37 81 M71 66 L83 81 M83 66 L71 81" stroke="#3d2614" stroke-width="1.3"/>
  <rect x="54" y="67" width="12" height="17" rx="1" fill="#3d2614"/>
  <path d="M24 89 H96" stroke="#e9c27f" stroke-width="1.5" stroke-linecap="round"/>
</svg>`;
const LOGO = `data:image/svg+xml;base64,${Buffer.from(LOGO_SVG).toString("base64")}`;

const data = {
  kind: "business",
  name: "Нүүдэл Ресторан",
  position: "Монгол үндэсний хоол",
  organization: "",
  photo: LOGO,
  hours: "Өдөр бүр 10:00–22:00",
  about:
    "Уламжлалт монгол хоолыг орчин үеийн амтаар. Бүх хоол өдөр бүр шинээр бэлтгэгдэнэ.",
  experience: [],
  phones: ["7000 0000"],
  email: "demo@example.com",
  address: "Даланзадгад, Өмнөговь",
  mapUrl: "",
  socials: [{ type: "facebook", label: "Нүүдэл Ресторан", url: "https://facebook.com" }],
  theme: "steppe",
  menu: [
    {
      title: "Халуун хоол",
      items: await Promise.all([
        item("Цуйван", 14500, "Гар аргаар хийсэн гурил, үхрийн мах, улирлын ногоо", "tsuivan"),
        item("Бууз", 12000, "Хонины махтай, уураар жигнэсэн · 6 ширхэг", "buuz"),
        item("Хуушуур", 10000, "Шарсан, шүүслэг махан дүүргэгчтэй · 4 ширхэг", "khuushuur"),
        item("Банштай шөл", 11500, "Жижиг гар банштай, ногоотой халуун шөл", "soup"),
        item("Хонины шорлог", 22000, "Нүүрсэн дээр шарсан, шарсан ногоо, соустай", "shorlog"),
        item("Үхрийн хавирга", 26000, "Удаан болгосон, утсан амттай, төмсний чипстэй", "ribs"),
      ]),
    },
    {
      title: "Салат",
      items: await Promise.all([
        item("Ногоон салат", 8500, "Улирлын шинэ ногоо, авокадо, оливын тос", "greenSalad"),
        item("Үхрийн махтай салат", 12500, "Шарсан үхрийн мах, өргөст хэмх, кунжут", "beefSalad"),
        item("Төмсний салат", 7000, "Гэрийн майонез, даршилсан өргөст хэмх"),
      ]),
    },
    {
      title: "Амттан",
      items: await Promise.all([
        item("Ааруултай бялуу", 9500, "Гэрийн аргаар хийсэн, какаотой", "cake"),
        item("Зайрмаг", 7500, "Ванилийн зайрмаг, карамель соус", "icecream"),
      ]),
    },
    {
      title: "Ундаа",
      items: await Promise.all([
        item("Сүүтэй цай", 3000, "Уламжлалт аргаар чанасан"),
        item("Ногоон цай", 4000, "Хятадын навчин цай · 400 мл", "tea"),
        item("Чацарганы жүүс", 6500, "Шинэхэн шахсан", "juice"),
        item("Латте", 6500, "Эспрессо, уурын сүү", "latte"),
        item("Рашаан ус", 2500, "0.5 л", "water"),
      ]),
    },
  ],
};

const client = new pg.Client({ connectionString: url });
await client.connect();
try {
  const { rows } = await client.query(
    `INSERT INTO people (id, data, paid_until)
     VALUES ('demo-menu', $1::jsonb, now() + interval '1 year')
     ON CONFLICT (id) DO UPDATE SET data = EXCLUDED.data, paid_until = EXCLUDED.paid_until, updated_at = now()
     RETURNING id, paid_until`,
    [JSON.stringify(data)],
  );
  const items = data.menu.reduce((n, s) => n + s.items.length, 0);
  console.log(`seeded /p/${rows[0].id} — ${data.menu.length} categories, ${items} items, active until ${rows[0].paid_until.toISOString().slice(0, 10)}`);
} finally {
  await client.end();
}
