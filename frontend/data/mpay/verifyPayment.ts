import axios from "@/lib/axios";
import { ErrorResponseGenerator, ResponseGenerator } from "@/data/response";
import type { ReturnType } from "@/types/return-type";

type TFormData = {
  otp: string;
  token: string;
  trxId: string;
};

export async function verifyPayment(formData: TFormData): Promise<ReturnType> {
  try {
    const response = await axios.post("/mapi-global/otp/verify", formData);

    return ResponseGenerator(response);
  } catch (error) {
    return ErrorResponseGenerator(error);
  }
}
