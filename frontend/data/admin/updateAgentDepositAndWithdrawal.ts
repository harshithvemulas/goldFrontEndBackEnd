import axios from "@/lib/axios";
import { ErrorResponseGenerator, ResponseGenerator } from "@/data/response";
import type { ReturnType } from "@/types/return-type";

export type TFormData = {
  depositCharge: number | null;
  withdrawalCharge: number | null;
  depositCommission: number | null;
  withdrawalCommission: number | null;
};

export async function updateAgentDepositAndWithdrawal(
  formData: TFormData,
  customerId: string | number,
): Promise<ReturnType> {
  try {
    const response = await axios.put(
      `/admin/agents/update-fees-commissions/${customerId}`,
      formData,
    );

    return ResponseGenerator(response);
  } catch (error) {
    return ErrorResponseGenerator(error);
  }
}
