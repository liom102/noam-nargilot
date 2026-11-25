import { Megaphone } from "lucide-react";
import { useSiteSettings } from "@/lib/site-settings.functions";

export function AnnouncementBar() {
  const { announcementEnabled, announcementText } = useSiteSettings();
  if (!announcementEnabled || !announcementText) return null;
  return (
    <div className="bg-sign px-5 py-2.5 text-center text-sm font-bold text-primary-foreground">
      <Megaphone className="ml-2 inline h-4 w-4 align-[-2px]" aria-hidden />
      {announcementText}
    </div>
  );
}
