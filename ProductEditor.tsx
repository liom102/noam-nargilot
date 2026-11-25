import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { ImagePlus, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { supabase } from "@/integrations/supabase/client";
import { adminCreateImageUpload, adminSaveProduct } from "@/lib/admin.functions";
import { cleanFlavors, parseFeatures, PRODUCT_IMAGE_BUCKET, type AdminProduct } from "@/lib/products";
import { Field, TextArea, TextInput, primaryButton, secondaryButton } from "./fields";

export function ProductEditor({
  product,
  defaultOrder,
  onClose,
}: {
  product: AdminProduct | null;
  defaultOrder: number;
  onClose: () => void;
}) {
  const save = useServerFn(adminSaveProduct);
  const createUpload = useServerFn(adminCreateImageUpload);
  const queryClient = useQueryClient();

  const [name, setName] = useState(product?.name ?? "");
  const [category, setCategory] = useState(product?.category ?? "נרגילות");
  const [price, setPrice] = useState(String(product?.price ?? ""));
  const [description, setDescription] = useState(product?.description ?? "");
  const [features, setFeatures] = useState((product?.features ?? []).join("\n"));
  const [flavors, setFlavors] = useState((product?.flavors ?? []).join("\n"));
  const [soldOut, setSoldOut] = useState<string[]>(product?.soldOutFlavors ?? []);
  const flavorList = cleanFlavors(flavors.split(/[\n,]/));
  const [image, setImage] = useState(product?.image ?? "");
  const [isVisible, setIsVisible] = useState(product?.isVisible ?? true);
  const [sortOrder, setSortOrder] = useState(String(product?.sortOrder ?? defaultOrder));
  const [uploading, setUploading] = useState(false);

  async function onFile(file: File | undefined) {
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) {
      toast.error("התמונה גדולה מדי (עד 10MB)");
      return;
    }
    setUploading(true);
    try {
      const ticket = await createUpload({ data: { contentType: file.type } });
      const { error } = await supabase.storage
        .from(PRODUCT_IMAGE_BUCKET)
        .uploadToSignedUrl(ticket.path, ticket.token, file, { contentType: file.type });
      if (error) throw new Error("העלאת התמונה נכשלה");
      setImage(ticket.url);
      toast.success("התמונה הועלתה");
    } catch (e) {
      toast.error((e as Error).message);
    } finally {
      setUploading(false);
    }
  }

  const mutation = useMutation({
    mutationFn: () =>
      save({
        data: {
          ...(product ? { id: product.id } : {}),
          name,
          category,
          price: Number(price),
          image,
          description,
          features: parseFeatures(features),
          flavors: flavorList,
          soldOutFlavors: soldOut.filter((f) => flavorList.includes(f)),
          isVisible,
          sortOrder: Number(sortOrder) || 0,
        },
      }),
    onSuccess: async () => {
      toast.success(product ? "המוצר עודכן" : "המוצר נוסף לאתר");
      await queryClient.invalidateQueries({ queryKey: ["admin-products"] });
      await queryClient.invalidateQueries({ queryKey: ["products"] });
      onClose();
    },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <Dialog open onOpenChange={(o) => !o && onClose()}>
      <DialogContent dir="rtl" className="max-h-[92vh] max-w-2xl overflow-y-auto rounded-3xl border-border bg-card text-right [&>button]:left-4 [&>button]:right-auto">
        <DialogHeader>
          <DialogTitle className="text-right font-display text-5xl font-normal leading-none">
            {product ? "עריכת מוצר" : "מוצר חדש"}
          </DialogTitle>
        </DialogHeader>
        <form
          className="mt-2 grid gap-5"
          onSubmit={(e) => {
            e.preventDefault();
            mutation.mutate();
          }}
        >
          <div className="flex flex-wrap items-center gap-5">
            <div className="flex h-32 w-40 items-center justify-center overflow-hidden rounded-2xl bg-photo-surface">
              {image ? (
                <img src={image} alt="תצוגה מקדימה" className="h-full w-full object-contain" />
              ) : (
                <ImagePlus className="h-8 w-8 text-primary-foreground/40" aria-hidden />
              )}
            </div>
            <label className={`${secondaryButton} cursor-pointer`}>
              {uploading ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : <ImagePlus className="h-4 w-4" aria-hidden />}
              {image ? "החלפת תמונה" : "העלאת תמונה"}
              <input
                type="file"
                accept="image/png,image/jpeg,image/webp,image/gif,image/avif"
                className="sr-only"
                disabled={uploading}
                onChange={(e) => onFile(e.target.files?.[0])}
              />
            </label>
          </div>

          <Field label="שם המוצר">
            <TextInput value={name} onChange={(e) => setName(e.target.value)} required maxLength={120} />
          </Field>
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="מחיר בשקלים">
              <TextInput type="number" inputMode="numeric" min={0} step={1} value={price} onChange={(e) => setPrice(e.target.value)} required dir="ltr" />
            </Field>
            <Field label="קטגוריה">
              <TextInput value={category} onChange={(e) => setCategory(e.target.value)} list="product-categories" />
              <datalist id="product-categories"><option value="נרגילות" /><option value="ווייפים" /><option value="טבק לנרגילה" /></datalist>
            </Field>
          </div>
          <Field label="תיאור">
            <TextArea value={description} onChange={(e) => setDescription(e.target.value)} maxLength={2000} />
          </Field>
          <Field label="מאפיינים" hint="כל מאפיין בשורה נפרדת">
            <TextArea value={features} onChange={(e) => setFeatures(e.target.value)} />
          </Field>
          <Field label="טעמים / דגמים לבחירה" hint="כל טעם בשורה נפרדת (או מופרד בפסיק). השאירו ריק אם אין בחירה.">
            <TextArea value={flavors} onChange={(e) => setFlavors(e.target.value)} placeholder={"ענבים קרח\nאבטיח\nמנטה"} />
          </Field>
          {flavorList.length > 0 && (
            <div>
              <p className="mb-2 text-sm font-semibold">לחצו על טעם שאזל מהמלאי:</p>
              <div className="flex flex-wrap gap-2">
                {flavorList.map((f) => {
                  const out = soldOut.includes(f);
                  return (
                    <button
                      key={f}
                      type="button"
                      onClick={() => setSoldOut((s) => (out ? s.filter((x) => x !== f) : [...s, f]))}
                      className={`rounded-full border px-3 py-1.5 text-sm ${out ? "border-destructive text-destructive line-through" : "border-primary text-primary"}`}
                    >
                      {f}{out ? " · אזל" : ""}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="מיקום ברשימה" hint="מספר קטן יותר מופיע ראשון">
              <TextInput type="number" step={1} value={sortOrder} onChange={(e) => setSortOrder(e.target.value)} dir="ltr" />
            </Field>
            <div className="flex items-center justify-between gap-4 rounded-2xl border border-border px-4 py-3 sm:mt-7">
              <span className="text-sm font-semibold">מוצג באתר</span>
              <Switch dir="ltr" checked={isVisible} onCheckedChange={setIsVisible} aria-label="מוצג באתר" />
            </div>
          </div>

          <div className="mt-2 flex flex-wrap gap-3">
            <button type="submit" className={primaryButton} disabled={mutation.isPending || uploading}>
              {mutation.isPending && <Loader2 className="h-4 w-4 animate-spin" aria-hidden />}
              שמירה
            </button>
            <button type="button" className={secondaryButton} onClick={onClose}>
              ביטול
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
