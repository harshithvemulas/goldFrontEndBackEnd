import axios from "@/lib/axios";
import { ErrorResponseGenerator, ResponseGenerator } from "@/data/response";
import type { ReturnType } from "@/types/return-type";

export async function initQr(formData: any): Promise<ReturnType> {
  try {
    const response = await axios.post("/mapi-global/merchant/qr", formData);

    return ResponseGenerator(response);
  } catch (error) {
    return ErrorResponseGenerator(error);
  }
}
