import { useEffect, useState } from "react";
import { isOpenAt } from "@/lib/store-info";
import { useSiteSettings } from "@/lib/site-settings.functions";
import { cn } from "@/lib/utils";

export function OpenStatus({ className }: { className?: string }) {
  const { hours } = useSiteSettings();
  const [open, setOpen] = useState<boolean | null>(null);

  useEffect(() => {
    const tick = () => setOpen(isOpenAt(new Date(), hours));
    tick();
    const id = window.setInterval(tick, 60_000);
    return () => window.clearInterval(id);
  }, [hours]);

  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-full border border-border px-3 py-1 text-xs font-semibold",
        className,
      )}
    >
      <span className="relative flex h-2 w-2">
        {open && <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />}
        <span className={cn("relative inline-flex h-2 w-2 rounded-full", open ? "bg-primary" : "bg-muted-foreground")} />
      </span>
      {open === null ? "שעות פתיחה" : open ? "פתוח עכשיו" : "סגור כרגע"}
    </span>
  );
}
