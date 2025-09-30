import { z } from "zod";

export const ElectricityBillSchema = z.object({
  // meter information
  meter_type: z.enum(["prepaid", "postpaid"]).default("prepaid"),
  meter_provider: z
    .string({ required_error: "Provider is required." })
    .min(1, "Provider is required."),
  meter_number: z
    .string({ required_error: "Meter number is required." })
    .min(1, "Meter number is required."),

  // payment Details
  sender_wallet_id: z.string({ required_error: "Select wallet." }),
  bill_amount: z.string({ required_error: "Amount is required." }),
  phone_number: z.string({ required_error: "Phone is required." }),
});

export type TElectricityBillData = z.infer<typeof ElectricityBillSchema>;
