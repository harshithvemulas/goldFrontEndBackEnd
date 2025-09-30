import axios from "@/lib/axios";
import { ErrorResponseGenerator, ResponseGenerator } from "@/data/response";
import type { ReturnType } from "@/types/return-type";

type TFormData = {
  depositFee?: number | string;
  withdrawalFee?: number | string;
  exchangeFee?: number | string;
  transferFee?: number | string;
  paymentFee?: number | string;
};

export async function updateMerchantFees(
  formData: TFormData,
  userId: number | string,
): Promise<ReturnType> {
  try {
    const response = await axios.put(
      `/admin/merchants/update-fees/${userId}`,
      formData,
    );
    return ResponseGenerator(response);
  } catch (error) {
    return ErrorResponseGenerator(error);
  }
}
