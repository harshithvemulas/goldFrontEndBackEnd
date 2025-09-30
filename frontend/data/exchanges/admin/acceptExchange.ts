import axios from "@/lib/axios";
import { ErrorResponseGenerator, ResponseGenerator } from "@/data/response";

export async function acceptExchangeMoney(id: string | number) {
  try {
    const res = await axios.put(`/admin/exchanges/accept/${id}`, {});
    return ResponseGenerator(res);
  } catch (error) {
    return ErrorResponseGenerator(error);
  }
}
