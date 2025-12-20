import prisma from "@/lib/prisma";

export default async function Home() {
  const users = await prisma.user.findMany();

  const dummyFair = {
    // Basic info
    id: "FAIR-001",
    name: "",
    slug: "",
    description: "",
    shortDescription: "",
    website: "",

    // Location
    venue: "",
    city: "",
    country: "",

    // Type
    type: "",
    category: "",

    // Images
    logo: "",
    coverImage: "",

    displayedProducts: "",
    tourNote: "",

    // Features
    isFeatured: false,
    isPublished: false,
    hasBanner: false,
    isSectoral: false,
    isDefiniteDeparture: false,

    // Dates
    dateString: "", // string
    startDate: "", // date
    endDate: "", // date

    // Services
    extraServices: "", // comma seperated string
    includedServices: "", // comma seperated string

    // Hotel
    hotel: {
      id: 1,
      name: "",
      description: "",
      address: "",
      city: "",
      country: "",
      zip: "",
      phone: "",
      email: "",
      images: [""],
    },

    // Images
    fairImages: {
      id: 1,
      name: "",
      description: "",
      images: [""],
    },

    // Tour Images
    tourImages: {
      id: 1,
      name: "",
      description: "",
      images: [""],
    },

    // Tour Programs
    tourPrograms: [
      {
        id: "ekonomik",
        title1: "Ekonomik Paket",
        title2: "4 Gece 5 Gün",
        title3: "3* Holiday Inn Express",
        singlePersonPrice: "890",
        twoPersonPrice: "250",
        programs: [
          {
            date: "1. Gün",
            activity:
              "İstanbul Havalimanı'ndan Guangzhou'ya hareket. Guangzhou Baiyun Havalimanı'nda karşılama ve otele transfer. Akşam Guangzhou şehir turu ve Pearl River tekne turu (opsiyonel).",
          },
          {
            date: "2. Gün",
            activity:
              "Kahvaltı sonrası Canton Fuarı'na transfer. Fuar ziyareti ve B2B görüşmeler. Akşam serbest zaman.",
          },
          {
            date: "3. Gün",
            activity:
              "Kahvaltı sonrası Canton Fuarı'na transfer. Fuar ziyareti ve fabrika ziyaretleri (opsiyonel). Akşam Çin mutfağı deneyimi.",
          },
          {
            date: "4. Gün",
            activity:
              "Kahvaltı sonrası serbest zaman. Chen Clan Ancestral Hall ve Beijing Lu Caddesi alışveriş turu (opsiyonel).",
          },
          {
            date: "5. Gün",
            activity:
              "Kahvaltı sonrası otelden çıkış ve havalimanına transfer. İstanbul'a dönüş.",
          },
        ],
      },
      {
        id: "standart",
        title1: "Standart Paket",
        title2: "5 Gece 6 Gün",
        title3: "4* Landmark Canton Hotel",
        singlePersonPrice: "1190",
        twoPersonPrice: "350",
        programs: [
          {
            date: "1. Gün",
            activity:
              "İstanbul Havalimanı'ndan Guangzhou'ya hareket. Guangzhou Baiyun Havalimanı'nda VIP karşılama ve otele transfer. Akşam Canton Kulesi ziyareti.",
          },
          {
            date: "2. Gün",
            activity:
              "Kahvaltı sonrası Canton Fuarı'na özel transfer. Fuar ziyareti ve rehber eşliğinde B2B görüşmeler. Akşam Dim Sum workshop.",
          },
          {
            date: "3. Gün",
            activity:
              "Kahvaltı sonrası Canton Fuarı'na transfer. Fuar ziyareti ve seçili tedarikçi fabrika ziyaretleri. Akşam Pearl River tekne turu.",
          },
          {
            date: "4. Gün",
            activity:
              "Kahvaltı sonrası Canton Fuarı'na transfer. Fuar ziyareti ve B2B görüşmeler. Akşam Guangzhou Opera House turu (opsiyonel).",
          },
          {
            date: "5. Gün",
            activity:
              "Kahvaltı sonrası Shamian Adası ve Chen Clan Ancestral Hall kültür turu. Öğleden sonra serbest zaman ve alışveriş imkanı.",
          },
          {
            date: "6. Gün",
            activity:
              "Kahvaltı sonrası otelden çıkış ve havalimanına transfer. İstanbul'a dönüş.",
          },
        ],
      },
      {
        id: "vip",
        title1: "VIP Paket",
        title2: "6 Gece 7 Gün",
        title3: "5* The Garden Hotel",
        singlePersonPrice: "1690",
        twoPersonPrice: "450",
        programs: [
          {
            date: "1. Gün",
            activity:
              "Business Class ile İstanbul-Guangzhou uçuşu. VIP karşılama ve limuzin ile otele transfer. Akşam özel Kanton yemeği deneyimi.",
          },
          {
            date: "2. Gün",
            activity:
              "Kahvaltı sonrası özel araç ile Canton Fuarı'na transfer. VIP giriş ve özel B2B görüşme alanı. Akşam Canton Kulesi'nde akşam yemeği.",
          },
          {
            date: "3. Gün",
            activity:
              "Kahvaltı sonrası fuar ziyareti ve premium tedarikçi fabrika ziyaretleri. Tercüman eşliğinde özel görüşmeler.",
          },
          {
            date: "4. Gün",
            activity:
              "Kahvaltı sonrası fuar ziyareti. Öğleden sonra Guangzhou şehir turu ve çay seremonisi deneyimi.",
          },
          {
            date: "5. Gün",
            activity:
              "Kahvaltı sonrası fuar ziyareti. Akşam Pearl River'da özel yat turu ve Michelin yıldızlı restoranda akşam yemeği.",
          },
          {
            date: "6. Gün",
            activity:
              "Kahvaltı sonrası Shenzhen teknoloji bölgesi turu. Akşam geleneksel Çin tıbbı ve spa deneyimi.",
          },
          {
            date: "7. Gün",
            activity:
              "Kahvaltı sonrası serbest zaman ve alışveriş. VIP transfer ile havalimanına uğurlama ve İstanbul'a dönüş.",
          },
        ],
      },
    ],
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center -mt-16">
      <h1 className="text-4xl font-bold mb-8 font-[family-name:var(--font-geist-sans)] text-[#333333]">
        Superblog
      </h1>
      <ol className="list-decimal list-inside font-[family-name:var(--font-geist-sans)]">
        {users.map((user) => (
          <li key={user.id} className="mb-2">
            {user.name}
          </li>
        ))}
      </ol>
    </div>
  );
}
