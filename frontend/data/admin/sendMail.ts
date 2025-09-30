import axios from "@/lib/axios";
import { ErrorResponseGenerator, ResponseGenerator } from "@/data/response";
import type { ReturnType } from "@/types/return-type";

type TFormData = {
  subject: string;
  message: string;
};

export async function sendMail(
  formData: TFormData,
  customerId: string | number,
): Promise<ReturnType> {
  try {
    const response = await axios.post(
      `/admin/users/send-email/${customerId}`,
      formData,
    );

    return ResponseGenerator(response);
  } catch (error) {
    return ErrorResponseGenerator(error);
  }
}
