import axios from "@/lib/axios";
import { ErrorResponseGenerator, ResponseGenerator } from "@/data/response";

export async function declineExchangeMoney(id: string | number) {
  try {
    const res = await axios.put(`/admin/exchanges/decline/${id}`, {});
    return ResponseGenerator(res);
  } catch (error) {
    return ErrorResponseGenerator(error);
  }
}
