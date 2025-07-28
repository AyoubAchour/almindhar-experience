import { NextRequest } from 'next/server';

interface RateLimitConfig {
  interval: number; // Time window in milliseconds
  uniqueTokenPerInterval: number; // Max number of unique tokens per interval
}

interface RateLimitStore {
  [key: string]: {
    count: number;
    resetTime: number;
  };
}

// In-memory store (consider using Redis for production)
const rateLimitStore: RateLimitStore = {};

export function rateLimit(config: RateLimitConfig) {
  return async (req: NextRequest): Promise<{ success: boolean; limit?: number; remaining?: number; reset?: number }> => {
    const identifier = getIdentifier(req);
    const now = Date.now();
    const key = `${identifier}`;

    // Clean up expired entries
    Object.keys(rateLimitStore).forEach(k => {
      if (rateLimitStore[k].resetTime < now) {
        delete rateLimitStore[k];
      }
    });

    if (!rateLimitStore[key] || rateLimitStore[key].resetTime < now) {
      rateLimitStore[key] = {
        count: 0,
        resetTime: now + config.interval,
      };
    }

    rateLimitStore[key].count++;

    const remaining = config.uniqueTokenPerInterval - rateLimitStore[key].count;
    const reset = rateLimitStore[key].resetTime;

    if (rateLimitStore[key].count > config.uniqueTokenPerInterval) {
      return {
        success: false,
        limit: config.uniqueTokenPerInterval,
        remaining: 0,
        reset,
      };
    }

    return {
      success: true,
      limit: config.uniqueTokenPerInterval,
      remaining: remaining >= 0 ? remaining : 0,
      reset,
    };
  };
}

function getIdentifier(req: NextRequest): string {
  // Try to get the real IP from various headers
  const forwardedFor = req.headers.get('x-forwarded-for');
  const realIp = req.headers.get('x-real-ip');
  const ip = forwardedFor?.split(',')[0] || realIp || 'unknown';
  
  // You could also use user ID if authenticated
  return ip;
}

// Pre-configured rate limiters
export const authRateLimit = rateLimit({
  interval: 15 * 60 * 1000, // 15 minutes
  uniqueTokenPerInterval: 5, // 5 attempts per 15 minutes
});

export const apiRateLimit = rateLimit({
  interval: 60 * 1000, // 1 minute
  uniqueTokenPerInterval: 30, // 30 requests per minute
});

export const uploadRateLimit = rateLimit({
  interval: 60 * 60 * 1000, // 1 hour
  uniqueTokenPerInterval: 10, // 10 uploads per hour
});