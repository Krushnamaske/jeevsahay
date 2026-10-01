// Lightweight in-memory rate limiter, no external dependency required.
// Good enough for a single-instance deployment; swap for express-rate-limit
// + Redis if this app is ever scaled across multiple processes.

const buckets = new Map();

function rateLimit({ windowMs = 15 * 60 * 1000, max = 10, message = 'Too many requests, please try again later.' } = {}) {
  return (req, res, next) => {
    const key = `${req.ip}:${req.baseUrl}${req.path}`;
    const now = Date.now();
    const bucket = buckets.get(key) || { count: 0, resetAt: now + windowMs };

    if (now > bucket.resetAt) {
      bucket.count = 0;
      bucket.resetAt = now + windowMs;
    }

    bucket.count += 1;
    buckets.set(key, bucket);

    if (bucket.count > max) {
      const retryAfterSec = Math.ceil((bucket.resetAt - now) / 1000);
      res.set('Retry-After', String(retryAfterSec));
      return res.status(429).json({ success: false, message });
    }

    next();
  };
}

// Periodic cleanup so the Map doesn't grow forever
setInterval(() => {
  const now = Date.now();
  for (const [key, bucket] of buckets.entries()) {
    if (now > bucket.resetAt) buckets.delete(key);
  }
}, 10 * 60 * 1000);

module.exports = rateLimit;
