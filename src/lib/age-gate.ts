export const AGE_GATE_KEY = "noam-age-verified";
export const MINIMUM_AGE = 18;
/** How long a confirmed "I'm 18+" answer is remembered. */
export const AGE_GATE_TTL_MS = 30 * 24 * 60 * 60 * 1000;

type StorageLike = Pick<Storage, "getItem" | "setItem" | "removeItem">;

export function rememberAdult(storage: StorageLike, now: number = Date.now()) {
  storage.setItem(AGE_GATE_KEY, String(now));
}

export function isAdultRemembered(storage: StorageLike, now: number = Date.now()): boolean {
  const raw = storage.getItem(AGE_GATE_KEY);
  if (!raw) return false;
  const at = Number(raw);
  if (!Number.isFinite(at) || now - at > AGE_GATE_TTL_MS) {
    storage.removeItem(AGE_GATE_KEY);
    return false;
  }
  return true;
}
