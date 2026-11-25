import { useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Clock, LogOut, Package, Store, Type } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { adminLogout } from "@/lib/admin.functions";
import { ProductsManager } from "./ProductsManager";
import { SettingsManager } from "./SettingsManager";

export function AdminDashboard() {
  const logout = useServerFn(adminLogout);
  const queryClient = useQueryClient();

  async function onLogout() {
    await logout();
    queryClient.removeQueries({ queryKey: ["admin-products"] });
    queryClient.removeQueries({ queryKey: ["admin-settings"] });
    await queryClient.invalidateQueries({ queryKey: ["admin-status"] });
  }

  return (
    <section className="mx-auto max-w-6xl px-5 py-12">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm font-bold tracking-widest text-primary">אזור ניהול</p>
          <h1 className="mt-2 font-display text-6xl leading-none sm:text-7xl">שליטה באתר</h1>
          <p className="mt-2 text-muted-foreground">כל שינוי שתשמרו כאן מופיע מיד באתר.</p>
        </div>
        <button
          type="button"
          onClick={onLogout}
          className="inline-flex items-center gap-2 rounded-full border border-border px-5 py-2.5 text-sm font-semibold hover:bg-secondary"
        >
          <LogOut className="h-4 w-4" aria-hidden />
          יציאה
        </button>
      </div>

      <Tabs defaultValue="products" dir="rtl" className="mt-10">
        <TabsList className="h-auto flex-wrap gap-1 rounded-2xl bg-card p-1.5">
          <TabsTrigger value="products" className="gap-2 rounded-xl px-4 py-2.5">
            <Package className="h-4 w-4" aria-hidden /> מוצרים
          </TabsTrigger>
          <TabsTrigger value="store" className="gap-2 rounded-xl px-4 py-2.5">
            <Store className="h-4 w-4" aria-hidden /> פרטי החנות
          </TabsTrigger>
          <TabsTrigger value="hours" className="gap-2 rounded-xl px-4 py-2.5">
            <Clock className="h-4 w-4" aria-hidden /> שעות פתיחה
          </TabsTrigger>
          <TabsTrigger value="texts" className="gap-2 rounded-xl px-4 py-2.5">
            <Type className="h-4 w-4" aria-hidden /> טקסטים והודעה
          </TabsTrigger>
        </TabsList>
        <TabsContent value="products" className="mt-8">
          <ProductsManager />
        </TabsContent>
        <TabsContent value="store" className="mt-8">
          <SettingsManager section="store" />
        </TabsContent>
        <TabsContent value="hours" className="mt-8">
          <SettingsManager section="hours" />
        </TabsContent>
        <TabsContent value="texts" className="mt-8">
          <SettingsManager section="texts" />
        </TabsContent>
      </Tabs>
    </section>
  );
}
