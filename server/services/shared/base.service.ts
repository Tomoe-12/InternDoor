import { db } from "@/db/client";
import { eq, count, sql } from "drizzle-orm";
import { logger } from "@/server/lib/logger";
import type { PaginatedResponse } from "@/server/types/common";

const DEFAULT_PAGE_SIZE = 10;

/**
 * Base service class with common CRUD operations
 */
export class BaseService {
  /**
   * Get all records with pagination
   */
  static async getAll<T>(
    table: any,
    size: number = DEFAULT_PAGE_SIZE,
    page: number = 1
  ): Promise<PaginatedResponse<T>> {
    const offset = (page - 1) * size;

    const [data, totalResult] = await Promise.all([
      db.select().from(table).limit(size).offset(offset),
      db.select({ count: count() }).from(table),
    ]);

    const totalCount = totalResult[0]?.count ?? 0;

    return {
      data,
      page,
      size,
      totalElements: totalCount,
      totalPages: Math.ceil(totalCount / size),
    };
  }

  /**
   * Get a single record by ID
   */
  static async getById<T extends { id: any }>(
    query: any,
    id: number
  ): Promise<T | null> {
    const result = await query.where(eq(query.id, id)).limit(1);
    return result[0] ?? null;
  }

  /**
   * Get a single record by email
   */
  static async getByEmail<T>(
    table: any,
    emailField: any,
    email: string
  ): Promise<T | null> {
    const normalized = email.trim().toLowerCase();
    const result = await db
      .select()
      .from(table)
      .where(sql`lower(${emailField}) = ${normalized}`)
      .limit(1);
    return result[0] ?? null;
  }

  /**
   * Check if email exists in a table
   */
  static async emailExists(
    table: any,
    emailField: any,
    email: string
  ): Promise<boolean> {
    const normalized = email.trim().toLowerCase();
    const rows = await db
      .select()
      .from(table)
      .where(sql`lower(${emailField}) = ${normalized}`)
      .limit(1);
    return rows.length > 0;
  }

  /**
   * Update a record
   */
  static async update<T>(
    table: any,
    input: T & { id: number },
    idField: any
  ): Promise<T | null> {
    const { id, ...updates } = input;

    const result = await db
      .update(table)
      .set({
        ...updates,
        updatedAt: new Date(),
      })
      .where(eq(idField, id))
      .returning();

    return result[0] ?? null;
  }

  /**
   * Delete a record
   */
  static async delete(table: any, idField: any, id: number) {
    await db.delete(table).where(eq(idField, id));
    return { success: true };
  }
}
