import { z } from "zod";
import { ImageSchema } from "@/schema/file-schema";

export const WithdrawMethodSchema = z.object({
  uploadLogo: ImageSchema,
  name: z.string({ required_error: "Name is required" }),
  countryCode: z.string({ required_error: "Country is required" }),
  currencyCode: z.string({ required_error: "Currency is required" }),
  active: z.boolean().default(false),
  recommended: z.boolean().default(false),
  minAmount: z.string().optional(),
  maxAmount: z.string().optional(),
  fixedCharge: z.string().optional(),
  percentageCharge: z.string().optional(),
  params: z
    .array(
      z.object({
        name: z
          .string()
          .refine((s) => !s.includes(" "), "No Spaces in name field!"),
        label: z.string(),
        type: z.string(),
        required: z.boolean(),
      }),
    )
    .optional(),
});

export type TWithdrawMethodData = z.infer<typeof WithdrawMethodSchema>;
