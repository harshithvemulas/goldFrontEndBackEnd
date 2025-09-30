import axios from "@/lib/axios";
import { ErrorResponseGenerator, ResponseGenerator } from "@/data/response";

// exchange rate change
export async function changeExchangeRate(
  exchangeId: string | number,
  rate: number,
) {
  try {
    const res = await axios.put(`/admin/exchanges/${exchangeId}`, {
      exchangeRate: rate,
    });
    return ResponseGenerator(res);
  } catch (error) {
    return ErrorResponseGenerator(error);
  }
}
