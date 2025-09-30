import axios from "@/lib/axios";
import { ErrorResponseGenerator, ResponseGenerator } from "@/data/response";

export async function createAdmin(formData: any) {
  try {
    const res = await axios.post(`/admin/users/create-admin`, formData);
    return ResponseGenerator(res);
  } catch (error) {
    return ErrorResponseGenerator(error);
  }
}
