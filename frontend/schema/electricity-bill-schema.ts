import { z } from "zod";

export const ElectricityBillSchema = z.object({
  meter_provider: z.string().min(1, "Provider is required."),
  meter_number: z.string().min(1, "Meter number is required."),
  sender_wallet_id: z.string().min(1, "Wallet is required."),
  bill_amount: z.string().min(1, "Enter the bill amount."),
});

export type TElectricityBillFormData = z.infer<typeof ElectricityBillSchema>;
