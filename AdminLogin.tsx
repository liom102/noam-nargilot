import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Loader2, LockKeyhole } from "lucide-react";
import { adminLogin } from "@/lib/admin.functions";

export function AdminLogin() {
  const login = useServerFn(adminLogin);
  const queryClient = useQueryClient();
  const [error, setError] = useState(false);
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const password = String(new FormData(e.currentTarget).get("password") ?? "");
    setBusy(true);
    setError(false);
    try {
      const res = await login({ data: { password } });
      if (res.ok) await queryClient.invalidateQueries({ queryKey: ["admin-status"] });
      else setError(true);
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-5 py-16">
      <form onSubmit={onSubmit} className="grain rounded-3xl border border-border bg-card p-8 shadow-glow sm:p-10">
        <span className="bg-sign inline-flex h-14 w-14 items-center justify-center rounded-2xl text-primary-foreground">
          <LockKeyhole className="h-6 w-6" aria-hidden />
        </span>
        <h1 className="mt-6 font-display text-6xl leading-none">אזור ניהול</h1>
        <p className="mt-3 text-muted-foreground">הכניסה למנהל האתר בלבד. הזינו את הסיסמה כדי להמשיך.</p>
        <label htmlFor="admin-password" className="mt-8 block text-sm font-semibold">
          סיסמה
        </label>
        <input
          id="admin-password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          className="mt-2 w-full rounded-xl border border-input bg-background px-4 py-3 text-base outline-none focus-visible:ring-2 focus-visible:ring-ring"
        />
        {error && (
          <p role="alert" className="mt-3 text-sm font-semibold text-destructive">
            הסיסמה שגויה, נסו שוב.
          </p>
        )}
        <button
          type="submit"
          disabled={busy}
          className="bg-sign mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full px-6 py-3.5 font-bold text-primary-foreground shadow-glow transition-transform hover:scale-[1.02] disabled:opacity-60"
        >
          {busy && <Loader2 className="h-4 w-4 animate-spin" aria-hidden />}
          כניסה
        </button>
      </form>
    </section>
  );
}
