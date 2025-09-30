import axios from "@/lib/axios";
import { ErrorResponseGenerator, ResponseGenerator } from "@/data/response";

export async function initPayment(trxId: string, method: string) {
  try {
    const res = await axios.post(`/mapi-global/init/${trxId}`, { method });
    return ResponseGenerator(res);
  } catch (error) {
    return ErrorResponseGenerator(error);
  }
}
