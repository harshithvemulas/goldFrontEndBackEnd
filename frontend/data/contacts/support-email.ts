import axios from "@/lib/axios";
import { ErrorResponseGenerator, ResponseGenerator } from "@/data/response";

export async function sendSupportEmail(formData: FormData) {
  try {
    const res = await axios.post(`/users/send-support-email`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return ResponseGenerator(res);
  } catch (error) {
    return ErrorResponseGenerator(error);
  }
}
