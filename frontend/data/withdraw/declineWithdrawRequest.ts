import axios from "@/lib/axios";
import { ErrorResponseGenerator, ResponseGenerator } from "@/data/response";

export async function declineWithdrawRequest(id: string | number) {
  try {
    if (!id) throw new Error("Withdraw id is required");

    const res = await axios.put(`/withdraw-requests/decline/${id}`, { id });
    return ResponseGenerator(res);
  } catch (error) {
    return ErrorResponseGenerator(error);
  }
}
