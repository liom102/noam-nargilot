import { describe, expect, it } from "vitest";
import { DEFAULT_SETTINGS, normalizeSettings, resolveSettings, toIntlPhone } from "./site-settings";

describe("site settings", () => {
  it("an empty saved record shows the store's current details", () => {
    const s = resolveSettings({});
    expect(s.phoneDisplay).toBe("050-529-8829");
    expect(s.whatsappHref).toBe("https://wa.me/972505298829");
  });

  it("a new phone number changes the call and WhatsApp links", () => {
    expect(toIntlPhone("052-111-2233")).toBe("972521112233");
    const s = resolveSettings({ phoneDisplay: "052-111-2233", whatsappPhone: "052-111-2233" });
    expect(s.phoneHref).toBe("tel:+972521112233");
    expect(s.whatsappIntl).toBe("972521112233");
  });

  it("admin cannot save closing time before opening time", () => {
    const hours = DEFAULT_SETTINGS.hours.map((h) => (h.day === 1 ? { ...h, open: "22:00", close: "10:00" } : h));
    expect(() => normalizeSettings({ ...DEFAULT_SETTINGS, hours }, true)).toThrow();
  });

  it("admin cannot save a rating above 5", () => {
    expect(() => normalizeSettings({ ...DEFAULT_SETTINGS, rating: 7 }, true)).toThrow();
  });
});
