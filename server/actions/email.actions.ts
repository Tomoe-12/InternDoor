import { actionClient, z } from "@/server/config/action";
import { sendEmail } from "@/server/lib/email";

/**
 * Send email action
 */
export const sendEmailAction = actionClient
  .schema(
    z.object({
      to: z.union([z.string().email(), z.array(z.string().email())]),
      subject: z.string().min(1),
      html: z.string().optional(),
      text: z.string().optional(),
    })
  )
  .action(async ({ parsedInput }) => {
    const result = await sendEmail(parsedInput);
    return result;
  });
