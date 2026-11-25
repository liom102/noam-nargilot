import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Switch } from "@/components/ui/switch";
import { adminGetSettings, adminSaveSettings } from "@/lib/admin.functions";
import type { EditableSettings } from "@/lib/site-settings";
import type { DayHours } from "@/lib/store-info";
import { Field, TextArea, TextInput, primaryButton } from "./fields";

type Section = "store" | "hours" | "texts";

export function SettingsManager({ section }: { section: Section }) {
  const get = useServerFn(adminGetSettings);
  const save = useServerFn(adminSaveSettings);
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery({ queryKey: ["admin-settings"], queryFn: () => get() });
  const [form, setForm] = useState<EditableSettings | null>(null);

  useEffect(() => {
    if (data) setForm(data);
  }, [data]);

  const mutation = useMutation({
    mutationFn: (values: EditableSettings) => save({ data: values }),
    onSuccess: async () => {
      toast.success("נשמר! השינויים כבר באתר");
      await queryClient.invalidateQueries({ queryKey: ["admin-settings"] });
      await queryClient.invalidateQueries({ queryKey: ["site-settings"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  if (isLoading || !form) {
    return (
      <p className="flex items-center gap-2 text-muted-foreground">
        <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> טוען…
      </p>
    );
  }

  const set = <K extends keyof EditableSettings>(key: K, value: EditableSettings[K]) =>
    setForm((f) => (f ? { ...f, [key]: value } : f));
  const setDay = (day: number, patch: Partial<DayHours>) =>
    set(
      "hours",
      form.hours.map((h) => (h.day === day ? { ...h, ...patch } : h)),
    );

  return (
    <form
      className="grid max-w-3xl gap-6 rounded-3xl border border-border bg-card p-6 sm:p-8"
      onSubmit={(e) => {
        e.preventDefault();
        mutation.mutate(form);
      }}
    >
      {section === "store" && (
        <>
          <h2 className="font-display text-5xl leading-none">פרטי החנות</h2>
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="טלפון">
              <TextInput value={form.phoneDisplay} onChange={(e) => set("phoneDisplay", e.target.value)} dir="ltr" required />
            </Field>
            <Field label="מספר וואטסאפ" hint="המספר שאליו מגיעות ההזמנות">
              <TextInput value={form.whatsappPhone} onChange={(e) => set("whatsappPhone", e.target.value)} dir="ltr" required />
            </Field>
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="כתובת מלאה" hint="משמשת גם לניווט ולמפה">
              <TextInput value={form.address} onChange={(e) => set("address", e.target.value)} required />
            </Field>
            <Field label="רחוב (לכותרת בעמוד יצירת קשר)">
              <TextInput value={form.street} onChange={(e) => set("street", e.target.value)} required />
            </Field>
          </div>
          <Field label="קישור לפייסבוק">
            <TextInput value={form.facebookHref} onChange={(e) => set("facebookHref", e.target.value)} dir="ltr" />
          </Field>
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="דירוג בגוגל (0–5)">
              <TextInput type="number" min={0} max={5} step={0.1} value={form.rating} onChange={(e) => set("rating", Number(e.target.value))} dir="ltr" />
            </Field>
            <Field label="מספר ביקורות">
              <TextInput type="number" min={0} step={1} value={form.ratingCount} onChange={(e) => set("ratingCount", Number(e.target.value))} dir="ltr" />
            </Field>
          </div>
        </>
      )}

      {section === "hours" && (
        <>
          <h2 className="font-display text-5xl leading-none">שעות פתיחה</h2>
          <ul className="divide-y divide-border">
            {form.hours.map((h) => (
              <li key={h.day} className="flex flex-wrap items-center gap-4 py-4">
                <span className="w-20 font-semibold">{h.label}</span>
                <label className="flex items-center gap-2 text-sm">
                  <Switch dir="ltr" checked={!h.closed} onCheckedChange={(v) => setDay(h.day, { closed: !v })} aria-label={`פתוח ביום ${h.label}`} />
                  {h.closed ? "סגור" : "פתוח"}
                </label>
                {!h.closed && (
                  <div className="flex items-center gap-2" dir="ltr">
                    <input
                      type="time"
                      value={h.open}
                      onChange={(e) => setDay(h.day, { open: e.target.value })}
                      aria-label={`פתיחה ביום ${h.label}`}
                      className="rounded-xl border border-input bg-background px-3 py-2"
                    />
                    <span>–</span>
                    <input
                      type="time"
                      value={h.close}
                      onChange={(e) => setDay(h.day, { close: e.target.value })}
                      aria-label={`סגירה ביום ${h.label}`}
                      className="rounded-xl border border-input bg-background px-3 py-2"
                    />
                  </div>
                )}
              </li>
            ))}
          </ul>
        </>
      )}

      {section === "texts" && (
        <>
          <h2 className="font-display text-5xl leading-none">הודעה בראש האתר</h2>
          <div className="flex items-center justify-between gap-4 rounded-2xl border border-border px-4 py-3">
            <span className="text-sm font-semibold">להציג הודעה בראש כל העמודים</span>
            <Switch dir="ltr" checked={form.announcementEnabled} onCheckedChange={(v) => set("announcementEnabled", v)} aria-label="הצגת הודעה" />
          </div>
          <Field label="טקסט ההודעה" hint='למשל: "מבצע סוף שבוע – 10% הנחה על כל הנרגילות"'>
            <TextInput value={form.announcementText} onChange={(e) => set("announcementText", e.target.value)} maxLength={200} />
          </Field>

          <h2 className="mt-4 font-display text-5xl leading-none">דף הבית</h2>
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="כותרת ראשית – שורה 1">
              <TextInput value={form.heroTitleLine1} onChange={(e) => set("heroTitleLine1", e.target.value)} maxLength={40} required />
            </Field>
            <Field label="כותרת ראשית – שורה 2 (צבעונית)">
              <TextInput value={form.heroTitleLine2} onChange={(e) => set("heroTitleLine2", e.target.value)} maxLength={40} />
            </Field>
          </div>
          <Field label="טקסט מתחת לכותרת">
            <TextArea value={form.heroText} onChange={(e) => set("heroText", e.target.value)} maxLength={400} />
          </Field>

          <h2 className="mt-4 font-display text-5xl leading-none">עמוד החנות</h2>
          <Field label="טקסט על החנות">
            <TextArea value={form.aboutText} onChange={(e) => set("aboutText", e.target.value)} maxLength={1200} />
          </Field>
        </>
      )}

      <div>
        <button type="submit" className={primaryButton} disabled={mutation.isPending}>
          {mutation.isPending && <Loader2 className="h-4 w-4 animate-spin" aria-hidden />}
          שמירת שינויים
        </button>
      </div>
    </form>
  );
}
