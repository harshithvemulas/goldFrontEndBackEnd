import axios from "@/lib/axios";
import { ErrorResponseGenerator, ResponseGenerator } from "@/data/response";
import type { ReturnType } from "@/types/return-type";

export async function toggleActivity(
  customerId: string | number,
): Promise<ReturnType> {
  try {
    const response = await axios.put(
      `/admin/users/toggle-active/${customerId}`,
      {},
    );

    return ResponseGenerator(response);
  } catch (error) {
    return ErrorResponseGenerator(error);
  }
}
