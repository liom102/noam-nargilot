import { useEffect, useState } from "react";
import { ShieldAlert, ShieldCheck } from "lucide-react";
import logo from "@/assets/noam-hookahs-logo.png.asset.json";
import { isAdultRemembered, MINIMUM_AGE, rememberAdult } from "@/lib/age-gate";

type Status = "checking" | "ask" | "adult" | "minor";

export function AgeGate() {
  const [status, setStatus] = useState<Status>("checking");

  useEffect(() => {
    let ok = false;
    try {
      ok = isAdultRemembered(window.localStorage);
    } catch {
      ok = false;
    }
    setStatus(ok ? "adult" : "ask");
  }, []);

  useEffect(() => {
    if (status === "adult") {
      document.body.style.overflow = "";
      return;
    }
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [status]);

  if (status === "adult") return null;

  const confirm = () => {
    try {
      rememberAdult(window.localStorage);
    } catch {
      /* storage blocked: still let them in for this visit */
    }
    setStatus("adult");
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="age-gate-title"
      className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-background px-5 py-10"
    >
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="animate-smoke absolute -top-1/4 left-1/4 h-[70vmax] w-[70vmax] rounded-full bg-glow blur-[120px] opacity-40" />
        <div className="animate-smoke absolute -bottom-1/3 -left-1/4 h-[60vmax] w-[60vmax] rounded-full bg-accent/30 blur-[140px] [animation-delay:-7s]" />
      </div>

      <div
        className={`grain glass relative w-full max-w-md overflow-hidden rounded-3xl border border-border p-8 text-center shadow-glow transition-opacity duration-300 sm:p-10 ${status === "checking" ? "opacity-0" : "opacity-100"}`}
      >
        <img
          src={logo.url}
          alt="נועם נרגילות – Noam Hookahs"
          className="mx-auto w-64 rounded-xl shadow-glow"
          width={828}
          height={204}
        />

        {status === "minor" ? (
          <div className="animate-rise mt-8">
            <ShieldAlert className="mx-auto h-10 w-10 text-ember" aria-hidden />
            <h2 id="age-gate-title" className="mt-4 font-display text-5xl leading-none">
              הכניסה מותרת מגיל {MINIMUM_AGE}
            </h2>
            <p className="mt-4 text-muted-foreground">
              האתר מציג מוצרי טבק ועישון ומיועד לבגירים בלבד. אין מכירה לקטינים — לא באתר ולא בחנות.
            </p>
            <button
              type="button"
              onClick={() => setStatus("ask")}
              className="mt-6 text-sm text-primary underline-offset-4 hover:underline"
            >
              טעיתי, חזרה לשאלה
            </button>
          </div>
        ) : (
          <div className="mt-8">
            <span className="inline-flex items-center gap-2 rounded-full border border-border px-3 py-1 text-xs tracking-wide text-primary">
              <ShieldCheck className="h-3.5 w-3.5" aria-hidden />
              אימות גיל
            </span>
            <h2 id="age-gate-title" className="mt-4 font-display text-6xl leading-[0.9]">
              האם מלאו לך <span className="text-sign">{MINIMUM_AGE}</span>?
            </h2>
            <p className="mt-4 text-muted-foreground">
              האתר כולל מוצרי טבק, נרגילות וסיגריות. הכניסה מותרת לבני {MINIMUM_AGE} ומעלה בלבד.
            </p>
            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              <button
                type="button"
                onClick={confirm}
                className="bg-sign rounded-full px-6 py-3.5 text-base font-bold text-primary-foreground shadow-glow transition-transform hover:scale-[1.03] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              >
                כן, אני מעל {MINIMUM_AGE}
              </button>
              <button
                type="button"
                onClick={() => setStatus("minor")}
                className="rounded-full border border-border px-6 py-3.5 text-base font-semibold text-foreground transition-colors hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                לא, אני מתחת ל-{MINIMUM_AGE}
              </button>
            </div>
            <p className="mt-6 text-xs text-muted-foreground">
              אין מכירה לקטינים. בחנות תתבקשו להציג תעודה מזהה.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
