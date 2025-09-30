import axios from "@/lib/axios";
import { ErrorResponseGenerator, ResponseGenerator } from "@/data/response";
import type { ReturnType } from "@/types/return-type";

export async function toggleMerchantSuspendStatus(
  merchantId: string | number,
): Promise<ReturnType> {
  try {
    const response = await axios.put(
      `/admin/merchants/toggle-suspend/${merchantId}`,
    );
    return ResponseGenerator(response);
  } catch (error) {
    return ErrorResponseGenerator(error);
  }
}
