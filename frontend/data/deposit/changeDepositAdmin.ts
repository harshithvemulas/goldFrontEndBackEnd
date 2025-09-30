import axios from "@/lib/axios";
import { ErrorResponseGenerator, ResponseGenerator } from "@/data/response";

export async function changeDepositAdmin(
  id: string | number,
  type: "accept" | "decline",
) {
  try {
    const res = await axios.put(`/admin/deposits/${type}/${id}`, { id });
    return ResponseGenerator(res);
  } catch (error) {
    return ErrorResponseGenerator(error);
  }
}
