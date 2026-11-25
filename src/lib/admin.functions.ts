import { createServerFn } from "@tanstack/react-start";
import { useSession } from "@tanstack/react-start/server";
import { createHash, timingSafeEqual } from "node:crypto";
import {
  normalizeProductInput,
  PRODUCT_IMAGE_BUCKET,
  PRODUCT_IMAGE_ROUTE,
  type AdminProduct,
  type ProductInput,
} from "@/lib/products";
import { normalizeSettings, type EditableSettings } from "@/lib/site-settings";

type AdminSession = { admin?: boolean };

function sessionConfig() {
  return {
    password: process.env["SESSION_SECRET"]!,
    name: "noam-admin",
    maxAge: 60 * 60 * 12, // 12 hours
    cookie: { httpOnly: true, secure: true, sameSite: "lax" as const, path: "/" },
  };
}

function passwordMatches(input: string, expected: string): boolean {
  const a = createHash("sha256").update(input, "utf8").digest();
  const b = createHash("sha256").update(expected, "utf8").digest();
  return timingSafeEqual(a, b);
}

async function requireAdmin() {
  const session = await useSession<AdminSession>(sessionConfig());
  if (!session.data.admin) throw new Error("נדרשת כניסה לאזור הניהול");
}

async function admin() {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  return supabaseAdmin;
}

export const getAdminStatus = createServerFn({ method: "GET" }).handler(async () => {
  const session = await useSession<AdminSession>(sessionConfig());
  return { unlocked: Boolean(session.data.admin) };
});

export const adminLogin = createServerFn({ method: "POST" })
  .inputValidator((data: { password: string }) => ({ password: String(data?.password ?? "") }))
  .handler(async ({ data }) => {
    const expected = process.env["ADMIN_PASSWORD"];
    if (!expected) throw new Error("ADMIN_PASSWORD is not set");
    if (!passwordMatches(data.password, expected)) return { ok: false as const };
    const session = await useSession<AdminSession>(sessionConfig());
    await session.update({ admin: true });
    return { ok: true as const };
  });

export const adminLogout = createServerFn({ method: "POST" }).handler(async () => {
  const session = await useSession<AdminSession>(sessionConfig());
  await session.clear();
  return { ok: true as const };
});

export const adminListProducts = createServerFn({ method: "GET" }).handler(async () => {
  await requireAdmin();
  const db = await admin();
  const { data, error } = await db
    .from("products")
    .select("*")
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: true });
  if (error) {
    console.error(error);
    throw new Error("טעינת המוצרים נכשלה");
  }
  return (data ?? []).map(
    (r): AdminProduct => ({
      id: r.id,
      name: r.name,
      category: r.category,
      price: r.price,
      image: r.image_url,
      description: r.description,
      features: r.features ?? [],
      flavors: r.flavors ?? [],
      soldOutFlavors: r.sold_out_flavors ?? [],
      isVisible: r.is_visible,
      sortOrder: r.sort_order,
    }),
  );
});

export const adminSaveProduct = createServerFn({ method: "POST" })
  .inputValidator((data: ProductInput) => normalizeProductInput(data))
  .handler(async ({ data }) => {
    await requireAdmin();
    const db = await admin();
    const row = {
      name: data.name,
      category: data.category,
      price: data.price,
      image_url: data.image,
      description: data.description,
      features: data.features,
      flavors: data.flavors,
      sold_out_flavors: data.soldOutFlavors,
      is_visible: data.isVisible,
      sort_order: data.sortOrder,
    };
    const { error } = data.id
      ? await db.from("products").update(row).eq("id", data.id)
      : await db.from("products").insert(row);
    if (error) {
      console.error(error);
      throw new Error("שמירת המוצר נכשלה");
    }
    return { ok: true as const };
  });

export const adminDeleteProduct = createServerFn({ method: "POST" })
  .inputValidator((data: { id: string }) => ({ id: String(data?.id ?? "") }))
  .handler(async ({ data }) => {
    await requireAdmin();
    const db = await admin();
    const { error } = await db.from("products").delete().eq("id", data.id);
    if (error) {
      console.error(error);
      throw new Error("מחיקת המוצר נכשלה");
    }
    return { ok: true as const };
  });

const EXT: Record<string, string> = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/webp": "webp",
  "image/gif": "gif",
  "image/avif": "avif",
};

/** Returns a one-time upload ticket; the browser uploads the file straight to storage. */
export const adminCreateImageUpload = createServerFn({ method: "POST" })
  .inputValidator((data: { contentType: string }) => ({ contentType: String(data?.contentType ?? "") }))
  .handler(async ({ data }) => {
    await requireAdmin();
    const ext = EXT[data.contentType];
    if (!ext) throw new Error("אפשר להעלות רק תמונות PNG, JPG, WEBP, GIF או AVIF");
    const path = `${crypto.randomUUID()}.${ext}`;
    const db = await admin();
    const { data: signed, error } = await db.storage.from(PRODUCT_IMAGE_BUCKET).createSignedUploadUrl(path);
    if (error || !signed) {
      console.error(error);
      throw new Error("העלאת התמונה נכשלה");
    }
    return { path, token: signed.token, url: `${PRODUCT_IMAGE_ROUTE}${path}` };
  });

export const adminGetSettings = createServerFn({ method: "GET" }).handler(async () => {
  await requireAdmin();
  const db = await admin();
  const { data } = await db.from("site_settings").select("data").eq("id", 1).maybeSingle();
  return normalizeSettings(data?.data ?? {});
});

export const adminSaveSettings = createServerFn({ method: "POST" })
  .inputValidator((data: EditableSettings) => normalizeSettings(data, true))
  .handler(async ({ data }) => {
    await requireAdmin();
    const db = await admin();
    const { error } = await db.from("site_settings").upsert({ id: 1, data: data as never });
    if (error) {
      console.error(error);
      throw new Error("שמירת ההגדרות נכשלה");
    }
    return { ok: true as const };
  });
