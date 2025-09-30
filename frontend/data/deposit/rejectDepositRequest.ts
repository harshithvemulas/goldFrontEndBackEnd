import axios from "@/lib/axios";
import { ErrorResponseGenerator, ResponseGenerator } from "@/data/response";

export async function rejectDepositRequest(id: string | number) {
  try {
    const res = await axios.put(`/deposit-requests/decline/${id}`, { id });
    return ResponseGenerator(res);
  } catch (error) {
    return ErrorResponseGenerator(error);
  }
}
