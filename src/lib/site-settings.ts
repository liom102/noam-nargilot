import { HOURS, STORE, type DayHours } from "@/lib/store-info";

/** What the admin can edit. Stored as JSON; missing keys fall back to defaults. */
export type EditableSettings = {
  phoneDisplay: string;
  whatsappPhone: string;
  address: string;
  street: string;
  facebookHref: string;
  rating: number;
  ratingCount: number;
  hours: DayHours[];
  announcementEnabled: boolean;
  announcementText: string;
  heroTitleLine1: string;
  heroTitleLine2: string;
  heroText: string;
  aboutText: string;
};

export type SiteSettings = EditableSettings & {
  phoneHref: string;
  whatsappHref: string;
  whatsappIntl: string;
  mapsHref: string;
  mapsEmbed: string;
};

export const DEFAULT_SETTINGS: EditableSettings = {
  phoneDisplay: STORE.phoneDisplay,
  whatsappPhone: STORE.phoneDisplay,
  address: STORE.address,
  street: STORE.street,
  facebookHref: STORE.facebookHref,
  rating: STORE.rating,
  ratingCount: STORE.ratingCount,
  hours: HOURS,
  announcementEnabled: false,
  announcementText: "",
  heroTitleLine1: "העשן הנכון",
  heroTitleLine2: "מתחיל כאן.",
  heroText:
    "נועם נרגילות — החנות של ראש העין לנרגילות, טבק ומוצרי עישון. מבחר רחב, ידע מקצועי ושירות אישי שגורם לכם לחזור.",
  aboutText:
    "נועם נרגילות, המוכרת גם בשם Mr. Smoke, נמצאת ברחוב שילה 20 בראש העין. אצלנו תמצאו נרגילות, טבק לנרגילה, סיגריות, פחמים ואביזרים — בחנות נקייה ומסודרת, עם אווירה טובה ויחס חם.",
};

/** Israeli local number ("050-529-8829") to international digits ("972505298829"). */
export function toIntlPhone(local: string): string {
  const digits = local.replace(/\D/g, "");
  if (digits.startsWith("972")) return digits;
  if (digits.startsWith("0")) return `972${digits.slice(1)}`;
  return digits;
}

const TIME = /^([01]\d|2[0-3]):[0-5]\d$/;
const DAY_LABELS = ["ראשון", "שני", "שלישי", "רביעי", "חמישי", "שישי", "שבת"];

function str(v: unknown, fallback: string, max = 500): string {
  return typeof v === "string" ? v.trim().slice(0, max) : fallback;
}

/**
 * Cleans settings coming from the admin form or the database. Throws a Hebrew
 * message when a value is invalid (strict = admin save); otherwise falls back.
 */
export function normalizeSettings(raw: unknown, strict = false): EditableSettings {
  const r = (raw && typeof raw === "object" ? raw : {}) as Record<string, unknown>;
  const d = DEFAULT_SETTINGS;
  const fail = (msg: string) => {
    if (strict) throw new Error(msg);
  };

  const phoneDisplay = str(r["phoneDisplay"], d.phoneDisplay, 30) || d.phoneDisplay;
  if (strict && phoneDisplay.replace(/\D/g, "").length < 9) fail("מספר הטלפון לא תקין");
  const whatsappPhone = str(r["whatsappPhone"], d.whatsappPhone, 30) || phoneDisplay;
  if (strict && whatsappPhone.replace(/\D/g, "").length < 9) fail("מספר הוואטסאפ לא תקין");

  let facebookHref = str(r["facebookHref"], d.facebookHref, 300);
  if (facebookHref && !facebookHref.startsWith("https://")) {
    fail("קישור הפייסבוק צריך להתחיל ב-https://");
    facebookHref = d.facebookHref;
  }

  let rating = Number(r["rating"] ?? d.rating);
  if (!Number.isFinite(rating) || rating < 0 || rating > 5) {
    fail("הדירוג צריך להיות בין 0 ל-5");
    rating = d.rating;
  }
  let ratingCount = Number(r["ratingCount"] ?? d.ratingCount);
  if (!Number.isInteger(ratingCount) || ratingCount < 0) {
    fail("מספר הביקורות צריך להיות מספר שלם");
    ratingCount = d.ratingCount;
  }

  const rawHours = Array.isArray(r["hours"]) ? (r["hours"] as unknown[]) : null;
  const hours: DayHours[] = DAY_LABELS.map((label, day) => {
    const fallback = d.hours.find((h) => h.day === day) ?? { day, label, open: "10:00", close: "20:00" };
    const h = rawHours?.find((x) => (x as DayHours)?.day === day) as Partial<DayHours> | undefined;
    if (!h) return { ...fallback, label };
    const closed = Boolean(h.closed);
    let open = typeof h.open === "string" ? h.open : fallback.open;
    let close = typeof h.close === "string" ? h.close : fallback.close;
    if (!TIME.test(open) || !TIME.test(close)) {
      fail(`שעה לא תקינה ביום ${label}`);
      open = fallback.open;
      close = fallback.close;
    }
    if (!closed && open >= close) {
      fail(`ביום ${label} שעת הסגירה חייבת להיות אחרי שעת הפתיחה`);
      open = fallback.open;
      close = fallback.close;
    }
    return { day, label, open, close, closed };
  });

  return {
    phoneDisplay,
    whatsappPhone,
    address: str(r["address"], d.address, 120) || d.address,
    street: str(r["street"], d.street, 60) || d.street,
    facebookHref,
    rating: Math.round(rating * 10) / 10,
    ratingCount,
    hours,
    announcementEnabled: typeof r["announcementEnabled"] === "boolean" ? r["announcementEnabled"] : d.announcementEnabled,
    announcementText: str(r["announcementText"], d.announcementText, 200),
    heroTitleLine1: str(r["heroTitleLine1"], d.heroTitleLine1, 40) || d.heroTitleLine1,
    heroTitleLine2: str(r["heroTitleLine2"], d.heroTitleLine2, 40),
    heroText: str(r["heroText"], d.heroText, 400) || d.heroText,
    aboutText: str(r["aboutText"], d.aboutText, 1200) || d.aboutText,
  };
}

/** Adds the links every page needs (call, WhatsApp, maps). */
export function resolveSettings(raw: unknown): SiteSettings {
  const s = normalizeSettings(raw);
  const whatsappIntl = toIntlPhone(s.whatsappPhone);
  const q = encodeURIComponent(`${STORE.nameHe} ${s.address}`);
  return {
    ...s,
    phoneHref: `tel:+${toIntlPhone(s.phoneDisplay)}`,
    whatsappIntl,
    whatsappHref: `https://wa.me/${whatsappIntl}`,
    mapsHref: `https://www.google.com/maps/search/?api=1&query=${q}`,
    mapsEmbed: `https://www.google.com/maps?q=${encodeURIComponent(s.address)}&output=embed`,
  };
}
