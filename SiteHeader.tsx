import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Menu, Phone, X } from "lucide-react";
import logo from "@/assets/noam-hookahs-logo.png.asset.json";
import { useSiteSettings } from "@/lib/site-settings.functions";

const NAV = [
  { to: "/", label: "בית" },
  { to: "/products", label: "המוצרים" },
  { to: "/about", label: "החנות" },
  { to: "/contact", label: "הגעה ויצירת קשר" },
] as const;

export function SiteHeader() {
  const store = useSiteSettings();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border glass">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between gap-6 px-5">
        <Link to="/" className="shrink-0" onClick={() => setOpen(false)}>
          <img
            src={logo.url}
            alt="נועם נרגילות – Noam Hookahs"
            className="h-11 w-auto rounded-lg shadow-glow sm:h-12"
            width={828}
            height={204}
          />
        </Link>

        <nav className="hidden items-center gap-1 md:flex" aria-label="ניווט ראשי">
          {NAV.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              activeOptions={{ exact: true }}
              className="rounded-full px-4 py-2 text-[15px] font-semibold text-muted-foreground transition-colors hover:text-foreground"
              activeProps={{ className: "bg-secondary text-foreground" }}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <a
            href={store.phoneHref}
            className="bg-sign hidden items-center gap-2 rounded-full px-5 py-2.5 text-sm font-bold text-primary-foreground shadow-glow transition-transform hover:scale-[1.03] sm:inline-flex"
          >
            <Phone className="h-4 w-4" aria-hidden />
            {store.phoneDisplay}
          </a>
          <button
            type="button"
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-border md:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "סגירת תפריט" : "פתיחת תפריט"}
            aria-expanded={open}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open && (
        <nav className="border-t border-border px-5 pb-6 pt-2 md:hidden" aria-label="ניווט נייד">
          {NAV.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              activeOptions={{ exact: true }}
              onClick={() => setOpen(false)}
              className="block border-b border-border py-4 font-display text-3xl text-muted-foreground"
              activeProps={{ className: "text-primary" }}
            >
              {item.label}
            </Link>
          ))}
          <a
            href={store.phoneHref}
            className="bg-sign mt-5 flex items-center justify-center gap-2 rounded-full px-5 py-3 font-bold text-primary-foreground"
          >
            <Phone className="h-4 w-4" aria-hidden />
            התקשרו {store.phoneDisplay}
          </a>
        </nav>
      )}
    </header>
  );
}
