import { createServerFn } from "@tanstack/react-start";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";
import { resolveSettings } from "@/lib/site-settings";

/** Public: the live store details and texts, merged over the defaults. */
export const getSiteSettings = createServerFn({ method: "GET" }).handler(async () => {
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
  const { data, error } = await client.from("site_settings").select("data").eq("id", 1).maybeSingle();
  if (error) console.error("getSiteSettings failed", error);
  return resolveSettings(data?.data ?? {});
});

export const siteSettingsQuery = queryOptions({
  queryKey: ["site-settings"],
  queryFn: () => getSiteSettings(),
  staleTime: 60_000,
});

export function useSiteSettings() {
  return useSuspenseQuery(siteSettingsQuery).data;
}
