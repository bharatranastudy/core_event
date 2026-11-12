interface RateLimitRecord {
  timestamps: number[];
}

const WINDOW_MS = 15 * 60 * 1000; // 15 minutes
const MAX_REQUESTS = 5;

const globalStore = globalThis as unknown as {
  __enquiryRateLimit?: Map<string, RateLimitRecord>;
};

function getStore(): Map<string, RateLimitRecord> {
  if (!globalStore.__enquiryRateLimit) {
    globalStore.__enquiryRateLimit = new Map<string, RateLimitRecord>();
  }
  return globalStore.__enquiryRateLimit;
}

export function checkEnquiryRateLimit(identifier: string): {
  allowed: boolean;
  retryAfterSeconds: number;
  remaining: number;
} {
  const now = Date.now();
  const store = getStore();
  const existing = store.get(identifier) ?? { timestamps: [] };

  // Prune timestamps outside the active window
  const recent = existing.timestamps.filter((ts) => now - ts < WINDOW_MS);

  if (recent.length >= MAX_REQUESTS) {
    const oldest = recent[0];
    const retryAfterSeconds = Math.max(
      1,
      Math.ceil((WINDOW_MS - (now - oldest)) / 1000)
    );
    store.set(identifier, { timestamps: recent });
    return {
      allowed: false,
      retryAfterSeconds,
      remaining: 0,
    };
  }

  recent.push(now);
  store.set(identifier, { timestamps: recent });

  // Periodically trim stale keys to keep memory bounded
  if (store.size > 5000) {
    for (const [key, value] of store.entries()) {
      if (value.timestamps.every((ts) => now - ts >= WINDOW_MS)) {
        store.delete(key);
      }
    }
  }

  return {
    allowed: true,
    retryAfterSeconds: 0,
    remaining: Math.max(0, MAX_REQUESTS - recent.length),
  };
}

export function getClientIp(headers: Headers): string {
  const forwardedFor = headers.get("x-forwarded-for");
  if (forwardedFor) {
    const first = forwardedFor.split(",")[0]?.trim();
    if (first) return first;
  }
  const realIp = headers.get("x-real-ip")?.trim();
  if (realIp) return realIp;
  return "unknown";
}
