import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Flame, HeartHandshake, MapPin, MessageCircle, Quote, Sparkles, Star, Store, Wind } from "lucide-react";
import heroHookah from "@/assets/hero-hookah.jpg";
import collection from "@/assets/hookah-collection.jpg";
import accessories from "@/assets/hookah-accessories.jpg";
import storeInterior from "@/assets/store-interior.jpg";
import { OpenStatus } from "@/components/OpenStatus";
import { useSiteSettings } from "@/lib/site-settings.functions";
import { useScrollReveal } from "@/lib/reveal";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "נועם נרגילות | חנות נרגילות וטבק בראש העין" },
      {
        name: "description",
        content: "נועם נרגילות (Mr. Smoke) – נרגילות, טבק לנרגילה, סיגריות, פחמים ואביזרים. שילה 20, ראש העין. דירוג 4.9 בגוגל.",
      },
      { property: "og:title", content: "נועם נרגילות | חנות נרגילות וטבק בראש העין" },
      { property: "og:description", content: "נרגילות, טבק ואביזרי עישון עם שירות אישי. שילה 20, ראש העין." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const MARQUEE = ["נרגילות", "טבק לנרגילה", "פחמים", "ראשים", "צינורות", "סיגריות", "טבק לגלגול", "מערכות חום", "אביזרים"];

const FEATURES = [
  { icon: HeartHandshake, title: "ייעוץ אישי", text: "מתלבטים בין דגמים או טעמים? נשב איתכם ונמצא בדיוק מה שמתאים לכם." },
  { icon: Sparkles, title: "מבחר שמתחדש", text: "נרגילות מודרניות וקלאסיות, ראשים, צינורות ואביזרים שמגיעים כל הזמן." },
  { icon: Flame, title: "כל מה שצריך לסשן", text: "מהפחם ועד הפייה — יוצאים מהחנות מוכנים לערב מושלם." },
  { icon: Store, title: "חנות שכונתית", text: "קרוב לבית, עם יחס חם ומחירים הוגנים. לקוחות חוזרים אלינו שוב ושוב." },
];

function Index() {
  const store = useSiteSettings();
  const rootRef = useScrollReveal<HTMLDivElement>();
  return (
    <div ref={rootRef}>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div aria-hidden className="pointer-events-none absolute inset-0">
          <div className="animate-smoke absolute -top-40 left-0 h-[42rem] w-[42rem] rounded-full bg-glow opacity-30 blur-[140px]" />
        </div>
        <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-5 pb-20 pt-12 lg:grid-cols-[1.1fr_0.9fr] lg:pt-20">
          <div className="animate-rise">
            <div className="flex flex-wrap items-center gap-3">
              <OpenStatus />
              <span className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1 text-xs font-semibold">
                <Star className="h-3.5 w-3.5 fill-primary text-primary" aria-hidden />
                {store.rating} · {store.ratingCount} ביקורות בגוגל
              </span>
            </div>
            <h1 className="mt-6 font-display text-[clamp(4.5rem,11vw,9.5rem)] leading-[0.82] tracking-tight">
              {store.heroTitleLine1}
              {store.heroTitleLine2 && (
                <>
                  <br />
                  <span className="text-sign">{store.heroTitleLine2}</span>
                </>
              )}
            </h1>
            <p className="mt-7 max-w-xl text-lg leading-relaxed text-muted-foreground sm:text-xl">
              {store.heroText}
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <a
                href={store.mapsHref}
                target="_blank"
                rel="noreferrer"
                className="bg-sign inline-flex items-center gap-2 rounded-full px-7 py-4 text-base font-bold text-primary-foreground shadow-glow transition-transform hover:scale-[1.03]"
              >
                <MapPin className="h-5 w-5" aria-hidden />
                נווטו לחנות
              </a>
              <a
                href={store.whatsappHref}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-border px-7 py-4 text-base font-semibold transition-colors hover:bg-secondary"
              >
                <MessageCircle className="h-5 w-5 text-primary" aria-hidden />
                שאלו אותנו בוואטסאפ
              </a>
            </div>
            <p className="mt-6 text-sm text-muted-foreground">
              <MapPin className="ml-1 inline h-4 w-4 text-primary" aria-hidden />
              {store.address}
            </p>
          </div>

          <div className="relative mx-auto w-full max-w-md animate-rise [animation-delay:150ms]">
            <div className="absolute -inset-6 rounded-[999px_999px_2rem_2rem] bg-glow opacity-40 blur-3xl" aria-hidden />
            <div className="grain relative overflow-hidden rounded-[999px_999px_2rem_2rem] border border-border shadow-glow">
              <img src={heroHookah} alt="נרגילת זכוכית מעוצבת בתאורה כחולה עם עשן" className="aspect-[3/4] w-full object-cover" width={1024} height={1536} />
            </div>
            <div className="glass absolute -bottom-6 right-6 rounded-2xl border border-border px-5 py-4 shadow-glow">
              <p className="font-display text-4xl leading-none text-primary">{store.rating}★</p>
              <p className="text-xs text-muted-foreground">דירוג הלקוחות שלנו בגוגל</p>
            </div>
          </div>
        </div>
      </section>

      {/* Marquee */}
      <div className="overflow-hidden border-y border-border bg-card/50 py-5" aria-hidden>
        <div className="animate-marquee flex w-max gap-10 whitespace-nowrap font-display text-4xl text-muted-foreground">
          {[...MARQUEE, ...MARQUEE].map((t, i) => (
            <span key={i} className="flex items-center gap-10">
              {t}
              <Wind className="h-6 w-6 text-primary" />
            </span>
          ))}
        </div>
      </div>

      {/* Bento */}
      <section className="mx-auto max-w-7xl px-5 py-24">
        <div className="reveal flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="text-sm font-bold tracking-widest text-primary">מה מחכה לכם בחנות</p>
            <h2 className="mt-3 font-display text-6xl leading-none sm:text-7xl">הכל לנרגילה מושלמת</h2>
          </div>
          <Link to="/products" className="group inline-flex items-center gap-2 font-semibold text-primary">
            לכל המוצרים
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" aria-hidden />
          </Link>
        </div>

        <div className="mt-12 grid gap-5 md:grid-cols-3 md:grid-rows-2">
          <Link to="/products" className="reveal group grain relative overflow-hidden rounded-3xl border border-border md:col-span-2 md:row-span-2">
            <img src={collection} alt="מגוון נרגילות על מדפים מוארים" className="h-full min-h-80 w-full object-cover transition-transform duration-700 group-hover:scale-105" loading="lazy" />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent" />
            <div className="absolute bottom-0 p-8">
              <h3 className="font-display text-6xl leading-none">נרגילות</h3>
              <p className="mt-2 max-w-md text-muted-foreground">דגמים מודרניים וקלאסיים, זכוכית מעוצבת ונירוסטה — לכל סגנון ולכל תקציב.</p>
            </div>
          </Link>
          <Link to="/products" className="reveal reveal-delay-1 group grain relative overflow-hidden rounded-3xl border border-border">
            <img src={accessories} alt="ראשים, פחמים, מלקחיים וצינור לנרגילה" className="h-full min-h-64 w-full object-cover transition-transform duration-700 group-hover:scale-105" loading="lazy" />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
            <div className="absolute bottom-0 p-6">
              <h3 className="font-display text-5xl leading-none">פחמים ואביזרים</h3>
            </div>
          </Link>
          <Link to="/products" className="reveal reveal-delay-2 group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-border bg-card p-6 transition-colors hover:bg-secondary">
            <Flame className="h-9 w-9 text-ember" aria-hidden />
            <div>
              <h3 className="font-display text-5xl leading-none">טבק וסיגריות</h3>
              <p className="mt-2 text-sm text-muted-foreground">טבק לנרגילה במגוון טעמים, סיגריות וטבק לגלגול. בחנות בלבד, מגיל 18.</p>
            </div>
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-7xl px-5">
        <div className="grid gap-px overflow-hidden rounded-3xl border border-border bg-border sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map((f, i) => (
            <div key={f.title} className={`reveal reveal-delay-${i + 1} bg-background p-8`}>
              <f.icon className="h-8 w-8 text-primary" aria-hidden />
              <h3 className="mt-5 font-display text-4xl leading-none">{f.title}</h3>
              <p className="mt-3 text-muted-foreground">{f.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Reviews */}
      <section className="mx-auto max-w-7xl px-5 py-24">
        <div className="reveal text-center">
          <p className="text-sm font-bold tracking-widest text-primary">מה הלקוחות אומרים</p>
          <h2 className="mt-3 font-display text-6xl leading-none sm:text-7xl">
            <span className="text-sign">{store.rating}</span> כוכבים בגוגל
          </h2>
          <p className="mt-3 text-muted-foreground">מתוך {store.ratingCount} ביקורות</p>
        </div>
        <div className="mt-12 grid gap-5 md:grid-cols-2">
          {[
            { text: "מקום מעולה ומחירים טובים, תמיד שירות טוב ומבחר גדול. אני לקוחה קבועה 😁", name: "נוריה ש." },
            { text: "Place is nice and tidy. The person at the counter is always nice. Lots of options to choose from.", name: "Jake C." },
          ].map((r, i) => (
            <figure key={r.name} className={`reveal reveal-delay-${i + 1} glass rounded-3xl border border-border p-8`}>
              <Quote className="h-8 w-8 text-primary" aria-hidden />
              <blockquote dir="auto" className="mt-4 text-xl leading-relaxed">{r.text}</blockquote>
              <figcaption className="mt-6 flex items-center justify-between text-sm text-muted-foreground">
                <span>{r.name} · ביקורת בגוגל</span>
                <span className="flex gap-0.5" aria-label="5 כוכבים">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-primary text-primary" aria-hidden />
                  ))}
                </span>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      {/* Visit */}
      <section className="mx-auto max-w-7xl px-5">
        <div className="reveal grain relative grid overflow-hidden rounded-[2rem] border border-border lg:grid-cols-2">
          <img src={storeInterior} alt="תצוגת נרגילות ואביזרים בחנות" className="h-full min-h-80 w-full object-cover" loading="lazy" />
          <div className="bg-card p-8 sm:p-12">
            <OpenStatus />
            <h2 className="mt-5 font-display text-6xl leading-none">קפצו לביקור</h2>
            <p className="mt-3 text-muted-foreground">{store.address} · {store.phoneDisplay}</p>
            <ul className="mt-8 divide-y divide-border border-y border-border">
              {store.hours.map((h) => (
                <li key={h.day} className="flex justify-between py-3">
                  <span className="font-semibold">{h.label}</span>
                  <span dir="ltr" className="tabular-nums text-muted-foreground">{h.closed ? "סגור" : `${h.open}–${h.close}`}</span>
                </li>
              ))}
            </ul>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/contact" className="bg-sign inline-flex items-center gap-2 rounded-full px-6 py-3 font-bold text-primary-foreground shadow-glow">
                הגעה ויצירת קשר
                <ArrowLeft className="h-4 w-4" aria-hidden />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
