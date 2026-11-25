import { createFileRoute } from "@tanstack/react-router";
import { Cigarette, Flame, Gauge, Leaf, MessageCircle, Package, ShieldCheck, Sparkles, Wind } from "lucide-react";
import collection from "@/assets/hookah-collection.jpg";
import accessories from "@/assets/hookah-accessories.jpg";
import { useSiteSettings } from "@/lib/site-settings.functions";
import { ProductCard } from "@/components/ProductCard";
import { productsQuery } from "@/lib/products.functions";
import type { Product } from "@/lib/products";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useScrollReveal } from "@/lib/reveal";

export const Route = createFileRoute("/products")({
  head: () => ({
    meta: [
      { title: "המוצרים | נועם נרגילות ראש העין" },
      { name: "description", content: "נרגילות, טבק לנרגילה, סיגריות, טבק לגלגול, פחמים, ראשים, צינורות ואביזרים — בחנות נועם נרגילות בראש העין." },
      { property: "og:title", content: "המוצרים | נועם נרגילות" },
      { property: "og:description", content: "כל מה שצריך לנרגילה ולעישון — במקום אחד בראש העין." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(productsQuery),
  component: Products,
});

const CATEGORIES = [
  { icon: Sparkles, title: "נרגילות", text: "דגמים מודרניים, קלאסיים וקומפקטיים. זכוכית מעוצבת, נירוסטה ועוד — נעזור לבחור לפי סגנון ותקציב." },
  { icon: Leaf, title: "טבק לנרגילה", text: "מגוון רחב של טעמים ועוצמות, מהמוכרים ועד החדשים ביותר." },
  { icon: Cigarette, title: "סיגריות וטבק לגלגול", text: "סיגריות, טבק לגלגול, ניירות ופילטרים." },
  { icon: Flame, title: "פחמים", text: "פחמי קוקוס טבעיים ופחמים מהירי הדלקה לסשן נקי ואחיד." },
  { icon: Package, title: "ראשים וקערות", text: "ראשי חימר, סיליקון ופאנל — כל ראש משנה את חוויית העישון." },
  { icon: Wind, title: "צינורות ופיות", text: "צינורות סיליקון רחיצים, פיות מעוצבות ופיות היגייניות חד-פעמיות." },
  { icon: Gauge, title: "מערכות ניהול חום", text: "לשליטה מדויקת בחום ובטעם, בלי להתעסק עם נייר כסף." },
  { icon: ShieldCheck, title: "אביזרים ותחזוקה", text: "מלקחיים, מברשות ניקוי, אטמים, תנורי פחמים ומצתים." },
];

function Products() {
  const store = useSiteSettings();
  const { data: products } = useSuspenseQuery(productsQuery);
  const rootRef = useScrollReveal<HTMLDivElement>();
  return (
    <div ref={rootRef}>
      <section className="relative overflow-hidden">
        <img src={collection} alt="" aria-hidden className="absolute inset-0 h-full w-full object-cover opacity-35" />
        <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/80 to-background" />
        <div className="relative mx-auto max-w-7xl px-5 pb-16 pt-24 sm:pt-32">
          <p className="text-sm font-bold tracking-widest text-primary">המוצרים שלנו</p>
          <h1 className="mt-3 font-display text-[clamp(4rem,9vw,8rem)] leading-[0.85]">
            כל מה שצריך,
            <br />
            <span className="text-sign">במקום אחד.</span>
          </h1>
          <p className="mt-6 max-w-xl text-lg text-muted-foreground">
            המלאי בחנות מתחדש כל הזמן. רוצים לבדוק אם דגם או טעם מסוים זמין? שלחו הודעה ונענה במהירות.
          </p>
        </div>
      </section>

      {groupByCategory(products).map(([cat, items]) => (
        <section key={cat} className="mx-auto max-w-7xl px-5 pb-20">
          <h2 className="font-display text-5xl leading-none sm:text-6xl">{cat}</h2>
          <div className="mt-8 grid gap-6">
            {items.map((p, i) => (
              <div key={p.id} className={`reveal reveal-delay-${Math.min(i + 1, 4)}`}>
                <ProductCard product={p} />
              </div>
            ))}
          </div>
        </section>
      ))}

      <section className="mx-auto max-w-7xl px-5">
        <h2 className="mb-8 font-display text-5xl leading-none sm:text-6xl">כל הקטגוריות בחנות</h2>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {CATEGORIES.map((c, i) => (
            <article key={c.title} className={`reveal reveal-delay-${(i % 4) + 1} group rounded-3xl border border-border bg-card p-7 transition-all hover:-translate-y-1 hover:shadow-glow`}>
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-secondary text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                <c.icon className="h-6 w-6" aria-hidden />
              </span>
              <h3 className="mt-6 font-display text-4xl leading-none">{c.title}</h3>
              <p className="mt-3 text-muted-foreground">{c.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 pt-20">
        <div className="reveal grain grid overflow-hidden rounded-[2rem] border border-border lg:grid-cols-[1fr_1.1fr]">
          <div className="flex flex-col justify-center bg-card p-8 sm:p-12">
            <h2 className="font-display text-6xl leading-none">לא בטוחים מה לבחור?</h2>
            <p className="mt-4 text-lg text-muted-foreground">
              ספרו לנו מה אתם אוהבים — טעם, עוצמה, תקציב — ונכין לכם המלצה אישית. הקנייה מתבצעת בחנות בלבד,
              לבני 18 ומעלה עם תעודה מזהה.
            </p>
            <a
              href={store.whatsappHref}
              target="_blank"
              rel="noreferrer"
              className="bg-sign mt-8 inline-flex w-fit items-center gap-2 rounded-full px-7 py-4 font-bold text-primary-foreground shadow-glow"
            >
              <MessageCircle className="h-5 w-5" aria-hidden />
              לבדיקת זמינות בוואטסאפ
            </a>
          </div>
          <img src={accessories} alt="ראשים, פחמים ואביזרים לנרגילה" className="h-full min-h-80 w-full object-cover" loading="lazy" />
        </div>
      </section>
    </div>
  );
}

function groupByCategory(list: Product[]): [string, Product[]][] {
  const map = new Map<string, Product[]>();
  for (const p of list) map.set(p.category, [...(map.get(p.category) ?? []), p]);
  return [...map.entries()];
}
