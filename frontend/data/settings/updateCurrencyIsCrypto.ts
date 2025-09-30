import axios from "@/lib/axios";
import { ErrorResponseGenerator, ResponseGenerator } from "@/data/response";
import type { ReturnType } from "@/types/return-type";

export async function updateCurrencyIsCrypto(
  id: string | number,
): Promise<ReturnType> {
  try {
    const response = await axios.put(
      `/admin/currencies/toggle-crypto/${id}`,
      {},
    );
    return ResponseGenerator(response);
  } catch (error) {
    return ErrorResponseGenerator(error);
  }
}
