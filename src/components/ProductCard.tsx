import { useState } from "react";
import { Check, MessageCircle } from "lucide-react";
import { formatPrice, whatsappOrderLink, type Product } from "@/lib/products";
import { useSiteSettings } from "@/lib/site-settings.functions";

export function ProductCard({ product }: { product: Product }) {
  const store = useSiteSettings();
  const hasFlavors = product.flavors.length > 0;
  const [flavor, setFlavor] = useState<string | null>(null);
  return (
    <article className="group grid overflow-hidden rounded-[2rem] border border-border bg-card shadow-glow md:grid-cols-2">
      <div className="relative flex items-center justify-center bg-photo-surface p-6">
        <img
          src={product.image}
          alt={product.name}
          className="aspect-[4/3] w-full object-contain transition-transform duration-700 group-hover:scale-105"
          width={1200}
          height={896}
          loading="lazy"
        />
        <span className="absolute right-5 top-5 rounded-full bg-background px-3 py-1 text-xs font-bold text-primary">
          {hasFlavors ? `${product.flavors.length} טעמים` : "חדש בחנות"}
        </span>
      </div>
      <div className="flex flex-col justify-center p-8 sm:p-10">
        <p className="text-sm font-bold tracking-widest text-primary">{product.category}</p>
        <h3 className="mt-2 font-display text-5xl leading-none sm:text-6xl">{product.name}</h3>
        <p className="mt-4 text-muted-foreground">{product.description}</p>
        <ul className="mt-6 space-y-2">
          {product.features.map((f) => (
            <li key={f} className="flex items-center gap-2 text-sm">
              <Check className="h-4 w-4 text-primary" aria-hidden />
              {f}
            </li>
          ))}
        </ul>
        {hasFlavors && (
          <div className="mt-6">
            <p className="text-sm font-bold">{flavor ? `נבחר: ${flavor}` : "בחרו טעם:"}</p>
            <div className="mt-3 flex flex-wrap gap-2" role="radiogroup" aria-label="בחירת טעם">
              {product.flavors.map((f) => {
                const out = product.soldOutFlavors.includes(f);
                const on = flavor === f;
                return (
                  <button
                    key={f}
                    type="button"
                    role="radio"
                    aria-checked={on}
                    disabled={out}
                    onClick={() => setFlavor(f)}
                    className={`rounded-full border px-4 py-2 text-sm font-semibold transition-colors ${
                      on
                        ? "border-primary bg-primary text-primary-foreground"
                        : out
                          ? "cursor-not-allowed border-border text-muted-foreground line-through opacity-60"
                          : "border-border hover:border-primary hover:text-primary"
                    }`}
                  >
                    {f}
                    {out && " · אזל"}
                  </button>
                );
              })}
            </div>
          </div>
        )}
        <div className="mt-8 flex flex-wrap items-center gap-5">
          <p className="font-display text-6xl leading-none text-sign" dir="ltr">
            {formatPrice(product.price)}
          </p>
          <a
            href={hasFlavors && !flavor ? undefined : whatsappOrderLink(store.whatsappIntl, product, flavor ?? undefined)}
            aria-disabled={hasFlavors && !flavor}
            onClick={(e) => {
              if (hasFlavors && !flavor) e.preventDefault();
            }}
            target="_blank"
            rel="noreferrer"
            className="bg-sign inline-flex items-center gap-2 rounded-full px-6 py-3.5 font-bold text-primary-foreground shadow-glow transition-transform hover:scale-[1.03] aria-disabled:cursor-not-allowed aria-disabled:opacity-50 aria-disabled:hover:scale-100"
          >
            <MessageCircle className="h-5 w-5" aria-hidden />
            {hasFlavors && !flavor ? "בחרו טעם כדי להזמין" : "להזמנה בוואטסאפ"}
          </a>
        </div>
        <p className="mt-4 text-xs text-muted-foreground">איסוף מהחנות ב{store.address}.</p>
      </div>
    </article>
  );
}
