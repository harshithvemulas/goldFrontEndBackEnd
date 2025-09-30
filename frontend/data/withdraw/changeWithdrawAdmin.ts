import axios from "@/lib/axios";
import { ErrorResponseGenerator, ResponseGenerator } from "@/data/response";

export async function changeWithdrawAdmin(
  id: string | number,
  type: "accept" | "decline",
) {
  try {
    const res = await axios.put(`/admin/withdraws/${type}/${id}`, { id });
    return ResponseGenerator(res);
  } catch (error) {
    return ErrorResponseGenerator(error);
  }
}
