import { createFileRoute } from "@tanstack/react-router";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { getAdminStatus } from "@/lib/admin.functions";
import { AdminLogin } from "@/components/admin/AdminLogin";
import { AdminDashboard } from "@/components/admin/AdminDashboard";

export const adminStatusQuery = queryOptions({
  queryKey: ["admin-status"],
  queryFn: () => getAdminStatus(),
});

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "אזור ניהול | נועם נרגילות" },
      { name: "description", content: "אזור הניהול של אתר נועם נרגילות." },
      { name: "robots", content: "noindex, nofollow" },
      { property: "og:title", content: "אזור ניהול | נועם נרגילות" },
      { property: "og:description", content: "אזור הניהול של אתר נועם נרגילות." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(adminStatusQuery),
  component: AdminPage,
});

function AdminPage() {
  const { data } = useSuspenseQuery(adminStatusQuery);
  return data.unlocked ? <AdminDashboard /> : <AdminLogin />;
}
