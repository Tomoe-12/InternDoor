import pino from "pino";

/**
 * Structured logger using Pino.
 * Keep transport disabled to avoid worker threads that crash Next.js / Vercel
 * runtimes. Writes directly to stdout/stderr instead.
 */
export const logger = pino({
  level: process.env.LOG_LEVEL || "info",
  // No transports to keep logging in-process (worker transports can exit)
  transport: undefined,
  base: {
    env: process.env.NODE_ENV,
  },
});

/**
 * Log levels:
 * - trace: Very detailed logs
 * - debug: Debug information
 * - info: General information
 * - warn: Warning messages
 * - error: Error messages
 * - fatal: Fatal errors
 */

export default logger;
