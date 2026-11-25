export type Product = {
  id: string;
  name: string;
  category: string;
  /** Price in shekels */
  price: number;
  image: string;
  description: string;
  features: string[];
  /** Flavors / models the visitor picks from (vapes, hookah tobacco...) */
  flavors: string[];
  soldOutFlavors: string[];
};

export type AdminProduct = Product & {
  isVisible: boolean;
  sortOrder: number;
};

/** What the admin form sends when creating or editing a product. */
export type ProductInput = {
  id?: string;
  name: string;
  category: string;
  price: number;
  image: string;
  description: string;
  features: string[];
  flavors: string[];
  soldOutFlavors: string[];
  isVisible: boolean;
  sortOrder: number;
};

export const PRODUCT_IMAGE_BUCKET = "product-images";
export const PRODUCT_IMAGE_ROUTE = "/api/public/product-images/";

export function formatPrice(price: number): string {
  return `₪${price.toLocaleString("en-US")}`;
}

export function whatsappOrderLink(phoneIntl: string, product: Pick<Product, "name" | "price">, flavor?: string): string {
  const what = flavor ? `${product.name} בטעם ${flavor}` : product.name;
  const text = `היי, אשמח להזמין ${what} (${formatPrice(product.price)})`;
  return `https://wa.me/${phoneIntl}?text=${encodeURIComponent(text)}`;
}

/** Split a textarea (one feature per line) into a clean list. */
export function parseFeatures(text: string): string[] {
  return text
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean)
    .slice(0, 12);
}

/**
 * Validates and cleans admin input. Throws a Hebrew message the admin can read.
 * Rules: a name is required, price is a whole number of shekels from 0 to 1,000,000.
 */
export function normalizeProductInput(raw: ProductInput): ProductInput {
  const name = String(raw.name ?? "").trim();
  if (!name) throw new Error("חובה למלא שם מוצר");
  if (name.length > 120) throw new Error("שם המוצר ארוך מדי");

  const price = Number(raw.price);
  if (!Number.isFinite(price) || !Number.isInteger(price) || price < 0 || price > 1_000_000) {
    throw new Error("המחיר חייב להיות מספר שלם בשקלים");
  }

  const sortOrder = Number.isFinite(Number(raw.sortOrder)) ? Math.trunc(Number(raw.sortOrder)) : 0;
  const image = String(raw.image ?? "").trim();
  if (image && !image.startsWith("/") && !image.startsWith("https://")) {
    throw new Error("כתובת התמונה לא תקינה");
  }

  const out: ProductInput = {
    name,
    category: String(raw.category ?? "").trim() || "נרגילות",
    price,
    image,
    description: String(raw.description ?? "").trim().slice(0, 2000),
    features: (Array.isArray(raw.features) ? raw.features : [])
      .map((f) => String(f).trim())
      .filter(Boolean)
      .slice(0, 12),
    flavors: cleanFlavors(raw.flavors),
    soldOutFlavors: [],
    isVisible: Boolean(raw.isVisible),
    sortOrder,
  };
  out.soldOutFlavors = cleanFlavors(raw.soldOutFlavors).filter((f) => out.flavors.includes(f));
  if (raw.id) out.id = String(raw.id);
  return out;
}

/** Unique, trimmed flavor names (max 100). */
export function cleanFlavors(list: unknown): string[] {
  const arr = Array.isArray(list) ? list : [];
  const out: string[] = [];
  for (const f of arr) {
    const v = String(f).trim().slice(0, 60);
    if (v && !out.includes(v)) out.push(v);
  }
  return out.slice(0, 100);
}
