// Default store facts (from public listings). The admin area can override
// them; pages read the live values through useSiteSettings().
export const STORE = {
  nameHe: "נועם נרגילות",
  nameEn: "Noam Hookahs",
  tagline: "Mr. Smoke",
  city: "ראש העין",
  street: "שילה 20",
  address: "שילה 20, ראש העין",
  phoneDisplay: "050-529-8829",
  phoneHref: "tel:+972505298829",
  whatsappHref: "https://wa.me/972505298829",
  facebookHref: "https://facebook.com/2182908791750223",
  mapsHref: "https://www.google.com/maps/search/?api=1&query=%D7%A0%D7%95%D7%A2%D7%9D+%D7%A0%D7%A8%D7%92%D7%99%D7%9C%D7%95%D7%AA+%D7%A9%D7%99%D7%9C%D7%94+20+%D7%A8%D7%90%D7%A9+%D7%94%D7%A2%D7%99%D7%9F",
  mapsEmbed: "https://www.google.com/maps?q=%D7%A9%D7%99%D7%9C%D7%94+20+%D7%A8%D7%90%D7%A9+%D7%94%D7%A2%D7%99%D7%9F&output=embed",
  rating: 4.9,
  ratingCount: 95,
} as const;

export type DayHours = { day: number; label: string; open: string; close: string; closed?: boolean };

// day: 0 = Sunday ... 6 = Saturday
export const HOURS: DayHours[] = [
  { day: 0, label: "ראשון", open: "11:00", close: "23:00" },
  { day: 1, label: "שני", open: "11:00", close: "23:00" },
  { day: 2, label: "שלישי", open: "11:00", close: "23:00" },
  { day: 3, label: "רביעי", open: "11:00", close: "23:00" },
  { day: 4, label: "חמישי", open: "11:00", close: "23:00" },
  { day: 5, label: "שישי", open: "10:00", close: "18:00" },
  { day: 6, label: "שבת", open: "20:00", close: "23:00" },
];

const toMinutes = (hhmm: string) => {
  const [h = "0", m = "0"] = hhmm.split(":");
  return Number(h) * 60 + Number(m);
};

/** Current day/minute in Israel time, regardless of the visitor's timezone. */
export function israelNow(date: Date): { day: number; minutes: number } {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Jerusalem",
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(date);
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? "";
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  return { day: days.indexOf(get("weekday")), minutes: Number(get("hour")) * 60 + Number(get("minute")) };
}

export function isOpenAt(date: Date, hours: DayHours[] = HOURS): boolean {
  const { day, minutes } = israelNow(date);
  const today = hours.find((h) => h.day === day);
  if (!today || today.closed) return false;
  return minutes >= toMinutes(today.open) && minutes < toMinutes(today.close);
}
