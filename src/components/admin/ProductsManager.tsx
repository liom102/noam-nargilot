import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { EyeOff, ImageOff, Loader2, Pencil, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { adminDeleteProduct, adminListProducts } from "@/lib/admin.functions";
import { formatPrice, type AdminProduct } from "@/lib/products";
import { ProductEditor } from "./ProductEditor";
import { primaryButton, secondaryButton } from "./fields";

export function ProductsManager() {
  const list = useServerFn(adminListProducts);
  const remove = useServerFn(adminDeleteProduct);
  const queryClient = useQueryClient();
  const [editing, setEditing] = useState<AdminProduct | "new" | null>(null);

  const { data: products, isLoading, error } = useQuery({
    queryKey: ["admin-products"],
    queryFn: () => list(),
  });

  const del = useMutation({
    mutationFn: (id: string) => remove({ data: { id } }),
    onSuccess: async () => {
      toast.success("המוצר נמחק");
      await queryClient.invalidateQueries({ queryKey: ["admin-products"] });
      await queryClient.invalidateQueries({ queryKey: ["products"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const nextOrder = (products?.reduce((m, p) => Math.max(m, p.sortOrder), 0) ?? 0) + 1;

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h2 className="font-display text-5xl leading-none">המוצרים באתר</h2>
        <button type="button" className={primaryButton} onClick={() => setEditing("new")}>
          <Plus className="h-4 w-4" aria-hidden /> מוצר חדש
        </button>
      </div>

      {isLoading && (
        <p className="mt-8 flex items-center gap-2 text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> טוען מוצרים…
        </p>
      )}
      {error && <p className="mt-8 text-destructive">{(error as Error).message}</p>}
      {products && products.length === 0 && (
        <p className="mt-8 rounded-2xl border border-dashed border-border p-8 text-center text-muted-foreground">
          עדיין אין מוצרים. לחצו על "מוצר חדש" כדי להוסיף.
        </p>
      )}

      <ul className="mt-8 grid gap-4">
        {products?.map((p) => (
          <li key={p.id} className="flex flex-wrap items-center gap-5 rounded-3xl border border-border bg-card p-4 sm:flex-nowrap">
            <div className="flex h-24 w-28 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-photo-surface">
              {p.image ? (
                <img src={p.image} alt="" className="h-full w-full object-contain" />
              ) : (
                <ImageOff className="h-6 w-6 text-primary-foreground/50" aria-hidden />
              )}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold tracking-widest text-primary">{p.category}</p>
              <p className="mt-1 truncate font-display text-3xl leading-none">{p.name}</p>
              <div className="mt-2 flex flex-wrap items-center gap-3 text-sm">
                <span className="font-bold" dir="ltr">{formatPrice(p.price)}</span>
                {!p.isVisible && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-secondary px-2.5 py-0.5 text-xs text-muted-foreground">
                    <EyeOff className="h-3 w-3" aria-hidden /> מוסתר מהאתר
                  </span>
                )}
              </div>
            </div>
            <div className="flex gap-2">
              <button type="button" className={secondaryButton} onClick={() => setEditing(p)}>
                <Pencil className="h-4 w-4" aria-hidden /> עריכה
              </button>
              <button
                type="button"
                className={`${secondaryButton} text-destructive`}
                disabled={del.isPending}
                onClick={() => {
                  if (window.confirm(`למחוק את "${p.name}"?`)) del.mutate(p.id);
                }}
              >
                <Trash2 className="h-4 w-4" aria-hidden /> מחיקה
              </button>
            </div>
          </li>
        ))}
      </ul>

      {editing && (
        <ProductEditor
          product={editing === "new" ? null : editing}
          defaultOrder={nextOrder}
          onClose={() => setEditing(null)}
        />
      )}
    </div>
  );
}
