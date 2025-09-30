import axios from "@/lib/axios";
import { ErrorResponseGenerator, ResponseGenerator } from "@/data/response";
import type { ReturnType } from "@/types/return-type";

type TFormData = {
  dailyTransferAmount: number;
};

export async function updateWalletTransferLimit(
  formData: TFormData,
  walletId: number | string,
): Promise<ReturnType> {
  try {
    const response = await axios.put(
      `/admin/wallets/transfer-limit/${walletId}`,
      formData,
    );
    return ResponseGenerator(response);
  } catch (error) {
    return ErrorResponseGenerator(error);
  }
}
