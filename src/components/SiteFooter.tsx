import { Link } from "@tanstack/react-router";
import { MapPin, MessageCircle, Phone } from "lucide-react";
import logo from "@/assets/noam-hookahs-logo.png.asset.json";
import { useSiteSettings } from "@/lib/site-settings.functions";

export function SiteFooter() {
  const store = useSiteSettings();
  return (
    <footer className="mt-24 border-t border-border">
      <div className="mx-auto grid max-w-7xl gap-12 px-5 py-16 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <img src={logo.url} alt="נועם נרגילות" className="h-14 w-auto rounded-lg" width={828} height={204} />
          <p className="mt-5 max-w-sm text-muted-foreground">
            חנות הנרגילות, הטבק ומוצרי העישון השכונתית של ראש העין. שירות אישי, מבחר רחב ואווירה טובה.
          </p>
          <div className="mt-6 flex flex-wrap gap-3 text-sm">
            <a href={store.whatsappHref} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 hover:bg-secondary">
              <MessageCircle className="h-4 w-4 text-primary" aria-hidden /> וואטסאפ
            </a>
            <a href={store.facebookHref} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 hover:bg-secondary">
              פייסבוק
            </a>
          </div>
        </div>

        <div>
          <h3 className="font-display text-3xl">שעות פתיחה</h3>
          <ul className="mt-4 space-y-1.5 text-sm">
            {store.hours.map((h) => (
              <li key={h.day} className="flex justify-between gap-6 text-muted-foreground">
                <span>{h.label}</span>
                <span dir="ltr" className="tabular-nums text-foreground">{h.closed ? "סגור" : `${h.open}–${h.close}`}</span>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="font-display text-3xl">בואו לבקר</h3>
          <ul className="mt-4 space-y-3 text-sm">
            <li>
              <a href={store.mapsHref} target="_blank" rel="noreferrer" className="flex items-center gap-2 hover:text-primary">
                <MapPin className="h-4 w-4 text-primary" aria-hidden /> {store.address}
              </a>
            </li>
            <li>
              <a href={store.phoneHref} className="flex items-center gap-2 hover:text-primary">
                <Phone className="h-4 w-4 text-primary" aria-hidden /> <span dir="ltr">{store.phoneDisplay}</span>
              </a>
            </li>
          </ul>
          <nav className="mt-6 flex flex-wrap gap-x-4 gap-y-2 text-sm text-muted-foreground" aria-label="קישורים">
            <Link to="/products" className="hover:text-foreground">המוצרים</Link>
            <Link to="/about" className="hover:text-foreground">החנות</Link>
            <Link to="/contact" className="hover:text-foreground">יצירת קשר</Link>
          </nav>
        </div>
      </div>

      <div className="border-t border-border bg-card/60">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-5 py-6 text-xs text-muted-foreground md:flex-row md:items-center md:justify-between">
          <p className="font-semibold text-foreground">
            אזהרה: העישון מזיק לבריאות וגורם לסרטן, למחלות לב ולהתמכרות. אין מכירה לקטינים מתחת לגיל 18.
          </p>
          <p>
            © {new Date().getFullYear()} נועם נרגילות · Mr. Smoke · ראש העין ·{" "}
            <Link to="/admin" className="hover:text-foreground">ניהול</Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
