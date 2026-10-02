// A small sliding-window limit on enquiries per client address, held in the function's memory.
// It is per instance (a cold start, or a second instance, starts empty), so it blunts a burst from
// one address rather than guaranteeing a ceiling; a Vercel Firewall rate-limit rule on
// /api/contact is the hard limit, if one is ever needed.

const WINDOW_MS = 10 * 60_000;
const MAX_PER_WINDOW = 5;
/** Addresses remembered at once; the least recently seen is forgotten first. */
const MAX_KEYS = 5_000;

const seen = new Map<string, number[]>();

/** Records an attempt from `key` and says whether it is over the limit (over-limit attempts are
    not recorded, so a client that stops is let back in once its window has passed). */
export function overLimit(key: string, now = Date.now()): boolean {
  const recent = (seen.get(key) ?? []).filter((t) => now - t < WINDOW_MS);
  seen.delete(key);
  if (recent.length >= MAX_PER_WINDOW) {
    seen.set(key, recent);
    return true;
  }
  recent.push(now);
  seen.set(key, recent);
  if (seen.size > MAX_KEYS) seen.delete(seen.keys().next().value!);
  return false;
}

/** The client's address as the platform reports it (Vercel sets both headers and overwrites any
    the client sends). */
export function clientKey(headers: Headers): string {
  return headers.get("x-real-ip") ?? headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
}
