import { createFileRoute } from "@tanstack/react-router";
import { PRODUCT_IMAGE_BUCKET } from "@/lib/products";

// Serves product photos from private storage. Only plain image file names are
// accepted, and these photos are meant to be public on the products page.
const SAFE_NAME = /^[a-zA-Z0-9-]+\.(png|jpg|jpeg|webp|gif|avif)$/;

export const Route = createFileRoute("/api/public/product-images/$")({
  server: {
    handlers: {
      GET: async ({ params }) => {
        const name = params._splat ?? "";
        if (!SAFE_NAME.test(name)) return new Response("Not found", { status: 404 });
        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
        const { data, error } = await supabaseAdmin.storage.from(PRODUCT_IMAGE_BUCKET).download(name);
        if (error || !data) return new Response("Not found", { status: 404 });
        return new Response(data, {
          headers: {
            "content-type": data.type || "application/octet-stream",
            "cache-control": "public, max-age=31536000, immutable",
          },
        });
      },
    },
  },
});
