type Entry = { count: number; resetAt: number };

const buckets = new Map<string, Entry>();

export function rateLimit(opts: { key: string; limit: number; windowMs: number }) {
  const now = Date.now();
  const e = buckets.get(opts.key);
  if (!e || now > e.resetAt) {
    buckets.set(opts.key, { count: 1, resetAt: now + opts.windowMs });
    return { ok: true, remaining: opts.limit - 1, resetAt: now + opts.windowMs };
  }
  if (e.count >= opts.limit) {
    return { ok: false, remaining: 0, resetAt: e.resetAt };
  }
  e.count += 1;
  return { ok: true, remaining: opts.limit - e.count, resetAt: e.resetAt };
}

export function getClientIp(req: Request): string {
  // Vercel / proxies typically forward this header
  const xf = req.headers.get("x-forwarded-for");
  if (xf) return xf.split(",")[0].trim();
  const real = req.headers.get("x-real-ip");
  if (real) return real;
  return "unknown";
}
