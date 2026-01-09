import pino from "pino";

/**
 * Structured logger using Pino
 * In development, uses simple console format. In production, uses JSON format.
 * Avoids worker threads which can cause issues in Next.js.
 */
export const logger = pino({
  level: process.env.LOG_LEVEL || "info",
  transport:
    process.env.NODE_ENV === "development"
      ? {
          target: "pino/file",
          options: {
            destination: 1, // stdout
          },
        }
      : undefined,
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
