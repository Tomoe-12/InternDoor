import { actionClient, z } from "@/server/config/action";
import { createCompanySchema, getCompaniesSchema, updateCompanySchema } from "@/server/schemas/company.schema";
import { CompanyService } from "@/server/services/company.service";

/**
 * Get all companies with pagination
 */
export const getCompaniesAction = actionClient
  .schema(getCompaniesSchema)
  .action(async ({ parsedInput }) => {
    const result = await CompanyService.getCompanies(parsedInput);
    return result;
  });

/**
 * Get a company by ID
 */
export const getCompanyByIdAction = actionClient
  .schema(z.object({ id: z.number() }))
  .action(async ({ parsedInput }) => {
    const company = await CompanyService.getCompanyById(parsedInput.id);
    if (!company) {
      throw new Error("Company not found");
    }
    return company;
  });

/**
 * Create a new company
 */
export const createCompanyAction = actionClient
  .schema(createCompanySchema)
  .action(async ({ parsedInput }) => {
    const company = await CompanyService.createCompany(parsedInput);
    return company;
  });

/**
 * Update a company
 */
export const updateCompanyAction = actionClient
  .schema(updateCompanySchema)
  .action(async ({ parsedInput }) => {
    const company = await CompanyService.updateCompany(parsedInput);
    if (!company) {
      throw new Error("Company not found");
    }
    return company;
  });

/**
 * Delete a company
 */
export const deleteCompanyAction = actionClient
  .schema(z.object({ id: z.number() }))
  .action(async ({ parsedInput }) => {
    await CompanyService.deleteCompany(parsedInput.id);
    return { success: true };
  });
