import axios from "@/lib/axios";
import { ErrorResponseGenerator, ResponseGenerator } from "@/data/response";
import type { ReturnType } from "@/types/return-type";

export async function paySettlement(
  customerId: string | number,
): Promise<ReturnType> {
  try {
    const response = await axios.post(
      `/admin/commissions/settlement/${customerId}`,
    );

    return ResponseGenerator(response);
  } catch (error) {
    return ErrorResponseGenerator(error);
  }
}
