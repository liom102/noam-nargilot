import { createServerFn } from "@tanstack/react-start";
import { queryOptions } from "@tanstack/react-query";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";
import type { Product } from "@/lib/products";

type Row = Database["public"]["Tables"]["products"]["Row"];

function toProduct(r: Row): Product {
  return {
    id: r.id,
    name: r.name,
    category: r.category,
    price: r.price,
    image: r.image_url,
    description: r.description,
    features: r.features ?? [],
      flavors: r.flavors ?? [],
      soldOutFlavors: r.sold_out_flavors ?? [],
  };
}

/** Public: products marked visible, in display order. */
export const listProducts = createServerFn({ method: "GET" }).handler(async () => {
  const key = process.env["SUPABASE_PUBLISHABLE_KEY"]!;
  const client = createClient<Database>(process.env["SUPABASE_URL"]!, key, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: {
      fetch: (input, init) => {
        const h = new Headers(init?.headers);
        if (key.startsWith("sb_") && h.get("Authorization") === `Bearer ${key}`) h.delete("Authorization");
        h.set("apikey", key);
        return fetch(input, { ...init, headers: h });
      },
    },
  });
  const { data, error } = await client
    .from("products")
    .select("*")
    .eq("is_visible", true)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: true });
  if (error) {
    console.error("listProducts failed", error);
    return [] as Product[];
  }
  return (data ?? []).map(toProduct);
});

export const productsQuery = queryOptions({
  queryKey: ["products"],
  queryFn: () => listProducts(),
});
