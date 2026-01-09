import { actionClient, z } from "@/server/config/action";
import {
  getConnectedAccountsSchema,
  createConnectedAccountSchema,
  deleteConnectedAccountSchema,
} from "@/server/schemas/connected-account.schema";
import { ConnectedAccountService } from "@/server/services/connected-account.service";

/**
 * Get connected accounts
 */
export const getConnectedAccountsAction = actionClient
  .schema(getConnectedAccountsSchema)
  .action(async ({ parsedInput }) => {
    const accounts = await ConnectedAccountService.getConnectedAccounts(parsedInput);
    return accounts;
  });

/**
 * Create connected account
 */
export const createConnectedAccountAction = actionClient
  .schema(createConnectedAccountSchema)
  .action(async ({ parsedInput }) => {
    const account = await ConnectedAccountService.createConnectedAccount(parsedInput);
    return account;
  });

/**
 * Delete connected account
 */
export const deleteConnectedAccountAction = actionClient
  .schema(deleteConnectedAccountSchema)
  .action(async ({ parsedInput }) => {
    const result = await ConnectedAccountService.deleteConnectedAccount(parsedInput);
    return result;
  });
