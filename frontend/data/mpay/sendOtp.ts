import axios from "@/lib/axios";
import { ErrorResponseGenerator, ResponseGenerator } from "@/data/response";
import type { ReturnType } from "@/types/return-type";

type TFormData = {
  email: string;
  trxId: string;
};

export async function sendOtp(formData: TFormData): Promise<ReturnType> {
  try {
    const response = await axios.post("/mapi-global/otp/init", formData);

    return ResponseGenerator(response);
  } catch (error) {
    return ErrorResponseGenerator(error);
  }
}
