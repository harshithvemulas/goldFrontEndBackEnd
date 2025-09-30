import axios from "@/lib/axios";
import { ErrorResponseGenerator, ResponseGenerator } from "@/data/response";
import type { ReturnType } from "@/types/return-type";

type TFormData = {
  ids: number[];
  subject: string;
  message: string;
};

export async function sendBulkMail(formData: TFormData): Promise<ReturnType> {
  try {
    const response = await axios.post(`/admin/users/send-bulk-email`, formData);
    return ResponseGenerator(response);
  } catch (error) {
    return ErrorResponseGenerator(error);
  }
}
