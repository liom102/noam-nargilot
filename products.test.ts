import { describe, expect, it } from "vitest";
import { formatPrice, normalizeProductInput, parseFeatures, type ProductInput } from "./products";

const base: ProductInput = {
  name: "נרגילה",
  flavors: [],
  soldOutFlavors: [],
  category: "נרגילות",
  price: 1050,
  image: "",
  description: "",
  features: [],
  isVisible: true,
  sortOrder: 0,
};

describe("products", () => {
  it("shows ₪1,050 and ₪1,000 the way the store prices them", () => {
    expect(formatPrice(1050)).toBe("₪1,050");
    expect(formatPrice(1000)).toBe("₪1,000");
  });

  it("admin cannot save a product without a name", () => {
    expect(() => normalizeProductInput({ ...base, name: "   " })).toThrow();
  });

  it("admin price must be a whole, non-negative number of shekels", () => {
    expect(() => normalizeProductInput({ ...base, price: -5 })).toThrow();
    expect(() => normalizeProductInput({ ...base, price: 10.5 })).toThrow();
    expect(normalizeProductInput({ ...base, price: 1000 }).price).toBe(1000);
  });

  it("features are entered one per line", () => {
    expect(parseFeatures("זהב\n\n  זכוכית  \n")).toEqual(["זהב", "זכוכית"]);
  });
});

import { cleanFlavors, normalizeProductInput as norm2, whatsappOrderLink as wa2 } from "./products";
describe("flavors", () => {
  it("dedupes and trims flavors, keeps only known sold-out ones", () => {
    const out = norm2({ name: "Vape", category: "ווייפים", price: 80, image: "", description: "", features: [], flavors: [" מנטה", "מנטה", "ענבים", ""], soldOutFlavors: ["ענבים", "לא קיים"], isVisible: true, sortOrder: 0 });
    expect(out.flavors).toEqual(["מנטה", "ענבים"]);
    expect(out.soldOutFlavors).toEqual(["ענבים"]);
    expect(cleanFlavors(["a", "a"])).toEqual(["a"]);
  });
  it("WhatsApp message includes the chosen flavor", () => {
    expect(decodeURIComponent(wa2("972500000000", { name: "Vape X", price: 80 }, "מנטה"))).toContain("Vape X בטעם מנטה");
  });
});
