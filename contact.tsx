import { createFileRoute } from "@tanstack/react-router";
import { Clock, MapPin, MessageCircle, Navigation, Phone } from "lucide-react";
import { OpenStatus } from "@/components/OpenStatus";
import { useSiteSettings } from "@/lib/site-settings.functions";
import { useScrollReveal } from "@/lib/reveal";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "הגעה ויצירת קשר | נועם נרגילות ראש העין" },
      { name: "description", content: "נועם נרגילות, שילה 20 ראש העין. טלפון 050-529-8829. שעות פתיחה, ניווט ווואטסאפ." },
      { property: "og:title", content: "הגעה ויצירת קשר | נועם נרגילות" },
      { property: "og:description", content: "כתובת, שעות פתיחה וטלפון של נועם נרגילות בראש העין." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Contact,
});

function Contact() {
  const store = useSiteSettings();
  const actions = [
    { icon: Phone, label: "התקשרו", value: store.phoneDisplay, href: store.phoneHref, external: false },
    { icon: MessageCircle, label: "וואטסאפ", value: "שלחו הודעה", href: store.whatsappHref, external: true },
    { icon: Navigation, label: "ניווט", value: store.address, href: store.mapsHref, external: true },
  ];

  const rootRef = useScrollReveal<HTMLElement>();
  return (
    <section ref={rootRef} className="mx-auto max-w-7xl px-5 pb-8 pt-16 lg:pt-24">
      <p className="text-sm font-bold tracking-widest text-primary">הגעה ויצירת קשר</p>
      <h1 className="mt-3 font-display text-[clamp(4rem,9vw,8rem)] leading-[0.85]">
        נתראה <span className="text-sign">ב{store.street}.</span>
      </h1>

      <div className="mt-12 grid gap-5 md:grid-cols-3">
        {actions.map((a, i) => (
          <a
            key={a.label}
            href={a.href}
            {...(a.external ? { target: "_blank", rel: "noreferrer" } : {})}
            className={`reveal reveal-delay-${i + 1} group flex items-center gap-5 rounded-3xl border border-border bg-card p-6 transition-all hover:-translate-y-1 hover:shadow-glow`}
          >
            <span className="bg-sign inline-flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl text-primary-foreground">
              <a.icon className="h-6 w-6" aria-hidden />
            </span>
            <span>
              <span className="block font-display text-3xl leading-none">{a.label}</span>
              <span className="mt-1 block text-muted-foreground" dir={a.label === "התקשרו" ? "ltr" : undefined}>
                {a.value}
              </span>
            </span>
          </a>
        ))}
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-[0.8fr_1.2fr]">
        <div className="reveal rounded-3xl border border-border bg-card p-8">
          <div className="flex items-center justify-between gap-4">
            <h2 className="flex items-center gap-2 font-display text-4xl leading-none">
              <Clock className="h-6 w-6 text-primary" aria-hidden />
              שעות פתיחה
            </h2>
            <OpenStatus />
          </div>
          <ul className="mt-6 divide-y divide-border">
            {store.hours.map((h) => (
              <li key={h.day} className="flex justify-between py-3.5">
                <span className="font-semibold">יום {h.label}</span>
                <span dir="ltr" className="tabular-nums text-muted-foreground">{h.closed ? "סגור" : `${h.open}–${h.close}`}</span>
              </li>
            ))}
          </ul>
          <p className="mt-6 text-sm text-muted-foreground">בחגים השעות עשויות להשתנות — מומלץ להתקשר לפני שמגיעים.</p>
          <p className="mt-6 flex items-start gap-2 rounded-2xl bg-secondary p-4 text-sm">
            <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden />
            אין מכירה לקטינים. בעת הקנייה תתבקשו להציג תעודה מזהה.
          </p>
        </div>
        <div className="reveal reveal-delay-1 overflow-hidden rounded-3xl border border-border bg-card">
          <iframe
            title={`מפה – נועם נרגילות, ${store.address}`}
            src={store.mapsEmbed}
            className="h-full min-h-[28rem] w-full grayscale invert-[0.92] hue-rotate-180"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </div>
    </section>
  );
}
