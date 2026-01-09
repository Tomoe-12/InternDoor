import { db } from "@/db/client";
import { userConnectedAccounts } from "@/db/schema/user_connected_accounts";
import { eq, and, or } from "drizzle-orm";
import type {
  GetConnectedAccountsInput,
  CreateConnectedAccountInput,
  DeleteConnectedAccountInput,
} from "@/server/schemas/connected-account.schema";

/**
 * Connected account service for OAuth provider management
 */
export class ConnectedAccountService {
  /**
   * Get connected accounts for a student or company
   */
  static async getConnectedAccounts(input: GetConnectedAccountsInput) {
    const { studentId, companyId } = input;

    if (!studentId && !companyId) {
      throw new Error("Either studentId or companyId is required");
    }

    const conditions = [];
    if (studentId) {
      conditions.push(eq(userConnectedAccounts.studentId, studentId));
    }
    if (companyId) {
      conditions.push(eq(userConnectedAccounts.companyId, companyId));
    }

    const result = await db
      .select()
      .from(userConnectedAccounts)
      .where(and(...conditions));

    return result;
  }

  /**
   * Create a connected account
   */
  static async createConnectedAccount(input: CreateConnectedAccountInput) {
    const { studentId, companyId, provider, providerId } = input;

    if (!studentId && !companyId) {
      throw new Error("Either studentId or companyId is required");
    }

    if (!provider || !providerId) {
      throw new Error("Provider and providerId are required");
    }

    // Check if connection already exists
    const existing = await db
      .select()
      .from(userConnectedAccounts)
      .where(
        and(
          eq(userConnectedAccounts.provider, provider),
          eq(userConnectedAccounts.providerId, providerId),
          studentId ? eq(userConnectedAccounts.studentId, studentId) : undefined,
          companyId ? eq(userConnectedAccounts.companyId, companyId) : undefined
        )
      )
      .limit(1);

    if (existing.length > 0) {
      throw new Error("Account already connected");
    }

    const result = await db
      .insert(userConnectedAccounts)
      .values({
        studentId: studentId ?? null,
        companyId: companyId ?? null,
        provider,
        providerId,
        connectedAt: new Date(),
      })
      .returning();

    return result[0];
  }

  /**
   * Delete a connected account
   */
  static async deleteConnectedAccount(input: DeleteConnectedAccountInput) {
    const { id } = input;

    await db.delete(userConnectedAccounts).where(eq(userConnectedAccounts.id, id));

    return { success: true };
  }
}
