<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.

## What Lovable manages

Rules outside this block are the project's own. Change the pieces below in
Lovable, not by hand. With the [Lovable MCP](https://mcp.lovable.dev)
connected, `send_message` asks Lovable to do it; otherwise ask the user to
use the editor.

- **Database.** Do not add or edit `supabase/migrations/` or `drizzle/`.
  Ask Lovable to change the schema.
- **Generated files.** Do not edit a file whose header says it is automatically
  generated.
- **AI gateway.** Keep model calls on Lovable's gateway, and keep
  `LOVABLE_API_KEY` out of browser code.
- **Connectors.** Lovable provides native connectors. `list_connectors` shows
  which are enabled; `add_connector` only returns the dashboard link. When a
  connector is enabled, calls go through the connector gateway and need
  `LOVABLE_API_KEY`. When Lovable does not provide one, users can bring their
  own key and store it in Secrets.
- **Secrets.** Lovable manages them. Do not put secret values in the repo.
<!-- LOVABLE:END -->

## Project rules
- Store facts, hours, banner and main texts are admin-editable: defaults in `src/lib/store-info.ts` + `src/lib/site-settings.ts`, saved overrides in the `site_settings` row; pages read them only via `useSiteSettings()` (root loader preloads it) so an admin save updates every page.
- The 18+ gate (`src/components/AgeGate.tsx` + `src/lib/age-gate.ts`) is mounted in `__root.tsx` so it covers every page; it reads storage in an effect to avoid hydration mismatch.
- The site is always dark (no light/dark switch); tokens are in `:root` of `src/styles.css`.
- Products live in the `products` table, managed from `/admin`; `src/lib/products.ts` holds shared types and validation used by both the admin save and the page.
- Any product can carry a flavor list (`flavors`, `sold_out_flavors`); the products page groups by `category` and shows a picker when flavors exist — one generic mechanism for vapes, tobacco and similar items.
- `/admin` is a shared-password gate (server secret `ADMIN_PASSWORD`, encrypted session cookie); every admin server function re-checks the session and only then uses the service-role client.
- Product photos live in the private `product-images` bucket (public buckets are blocked) and are served through `/api/public/product-images/<file>`.
