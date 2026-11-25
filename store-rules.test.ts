import { describe, expect, it } from "vitest";
import { AGE_GATE_KEY, isAdultRemembered, rememberAdult } from "./age-gate";
import { isOpenAt } from "./store-info";

function memoryStorage() {
  const m = new Map<string, string>();
  return {
    getItem: (k: string) => m.get(k) ?? null,
    setItem: (k: string, v: string) => void m.set(k, v),
    removeItem: (k: string) => void m.delete(k),
  };
}

describe("age gate", () => {
  it("a visitor who never confirmed 18+ is not let in", () => {
    expect(isAdultRemembered(memoryStorage())).toBe(false);
  });

  it("a confirmed 18+ visitor is remembered", () => {
    const s = memoryStorage();
    rememberAdult(s, 1_000);
    expect(isAdultRemembered(s, 1_000 + 60_000)).toBe(true);
  });

  it("confirmation expires after 30 days", () => {
    const s = memoryStorage();
    rememberAdult(s, 0);
    expect(isAdultRemembered(s, 31 * 24 * 60 * 60 * 1000)).toBe(false);
    expect(s.getItem(AGE_GATE_KEY)).toBeNull();
  });
});

describe("opening hours (Israel time)", () => {
  // Nov 2026: Israel is UTC+2. 2026-11-22 is a Sunday.
  it("open Sunday 12:00", () => expect(isOpenAt(new Date("2026-11-22T10:00:00Z"))).toBe(true));
  it("closed Sunday 23:30", () => expect(isOpenAt(new Date("2026-11-22T21:30:00Z"))).toBe(false));
  it("open Friday 17:00", () => expect(isOpenAt(new Date("2026-11-27T15:00:00Z"))).toBe(true));
  it("closed Friday 19:00", () => expect(isOpenAt(new Date("2026-11-27T17:00:00Z"))).toBe(false));
  it("closed Saturday 15:00", () => expect(isOpenAt(new Date("2026-11-28T13:00:00Z"))).toBe(false));
  it("open Saturday 21:00", () => expect(isOpenAt(new Date("2026-11-28T19:00:00Z"))).toBe(true));
});

describe("admin-edited opening hours", () => {
  it("a day the admin marks closed shows the store as closed", async () => {
    const { HOURS } = await import("./store-info");
    const hours = HOURS.map((h) => (h.day === 0 ? { ...h, closed: true } : h));
    expect(isOpenAt(new Date("2026-11-22T10:00:00Z"), hours)).toBe(false);
  });
});
