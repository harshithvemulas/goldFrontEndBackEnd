import axios from "@/lib/axios";
import { ErrorResponseGenerator, ResponseGenerator } from "@/data/response";
import type { ReturnType } from "@/types/return-type";

export async function declineMerchant(
  customerId: string | number,
): Promise<ReturnType> {
  try {
    const response = await axios.put(
      `/admin/merchants/decline/${customerId}`,
      {},
    );
    return ResponseGenerator(response);
  } catch (error) {
    return ErrorResponseGenerator(error);
  }
}
