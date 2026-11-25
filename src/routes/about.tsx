import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Star } from "lucide-react";
import storeInterior from "@/assets/store-interior.jpg";
import heroHookah from "@/assets/hero-hookah.jpg";
import { useSiteSettings } from "@/lib/site-settings.functions";
import { useScrollReveal } from "@/lib/reveal";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "החנות | נועם נרגילות ראש העין" },
      { name: "description", content: "הכירו את נועם נרגילות (Mr. Smoke) – חנות הנרגילות והטבק השכונתית של ראש העין, עם שירות אישי ומבחר רחב." },
      { property: "og:title", content: "החנות | נועם נרגילות" },
      { property: "og:description", content: "חנות שכונתית בראש העין עם שירות אישי, ידע מקצועי ומבחר רחב." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: About,
});

const VALUES = [
  { n: "01", title: "שירות אישי", text: "כל לקוח מקבל זמן, הסבר והמלצה — בין אם זו הנרגילה הראשונה שלכם ובין אם העשירית." },
  { n: "02", title: "ידע מקצועי", text: "אנחנו מכירים כל מוצר על המדף ויודעים להתאים ראש, פחם וטבק לחוויה שאתם מחפשים." },
  { n: "03", title: "אחריות", text: "מכירה לבגירים בלבד, תמיד. עם תעודה מזהה, בלי יוצאים מן הכלל." },
];

function About() {
  const store = useSiteSettings();
  const rootRef = useScrollReveal<HTMLDivElement>();
  return (
    <div ref={rootRef}>
      <section className="mx-auto grid max-w-7xl items-center gap-12 px-5 pb-20 pt-16 lg:grid-cols-2 lg:pt-24">
        <div>
          <p className="text-sm font-bold tracking-widest text-primary">נעים להכיר</p>
          <h1 className="mt-3 font-display text-[clamp(4rem,9vw,8rem)] leading-[0.85]">
            החנות השכונתית
            <br />
            <span className="text-sign">של ראש העין.</span>
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground">
            {store.aboutText}
          </p>
          <div className="mt-8 inline-flex items-center gap-3 rounded-2xl border border-border bg-card px-5 py-4">
            <span className="font-display text-5xl leading-none text-primary">{store.rating}</span>
            <span className="text-sm text-muted-foreground">
              <span className="flex gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-primary text-primary" aria-hidden />
                ))}
              </span>
              {store.ratingCount} ביקורות בגוגל
            </span>
          </div>
        </div>
        <div className="grain relative overflow-hidden rounded-[2rem] border border-border shadow-glow">
          <img src={storeInterior} alt="פנים החנות עם מדפי נרגילות ותאורה כחולה" className="aspect-[4/3] w-full object-cover" />
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5">
        <div className="grid gap-5 md:grid-cols-3">
          {VALUES.map((v, i) => (
            <div key={v.n} className={`reveal reveal-delay-${i + 1} rounded-3xl border border-border bg-card p-8`}>
              <span className="font-display text-6xl leading-none text-sign">{v.n}</span>
              <h2 className="mt-4 font-display text-4xl leading-none">{v.title}</h2>
              <p className="mt-3 text-muted-foreground">{v.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 pt-20">
        <div className="reveal grain relative overflow-hidden rounded-[2rem] border border-border">
          <img src={heroHookah} alt="" aria-hidden className="absolute inset-0 h-full w-full object-cover opacity-30" />
          <div className="absolute inset-0 bg-gradient-to-l from-background via-background/85 to-background/40" />
          <div className="relative max-w-2xl p-10 sm:p-16">
            <h2 className="font-display text-6xl leading-none sm:text-7xl">מחכים לכם בחנות</h2>
            <p className="mt-4 text-lg text-muted-foreground">בואו להתייעץ, להריח, לראות מקרוב ולבחור בדיוק את מה שמתאים לכם.</p>
            <Link to="/contact" className="bg-sign mt-8 inline-flex items-center gap-2 rounded-full px-7 py-4 font-bold text-primary-foreground shadow-glow">
              איך מגיעים
              <ArrowLeft className="h-4 w-4" aria-hidden />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
