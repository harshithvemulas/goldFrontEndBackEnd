import axios from "@/lib/axios";
import { ErrorResponseGenerator, ResponseGenerator } from "@/data/response";

export async function editAdmin(formData: any, staffId: string) {
  try {
    const res = await axios.put(`/admin/users/edit-admin/${staffId}`, formData);
    return ResponseGenerator(res);
  } catch (error) {
    return ErrorResponseGenerator(error);
  }
}
