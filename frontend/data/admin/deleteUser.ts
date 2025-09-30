import axios from "@/lib/axios";
import { ErrorResponseGenerator, ResponseGenerator } from "@/data/response";
import type { ReturnType } from "@/types/return-type";

// Delete a user
export async function deleteUser(
  customerId: string | number,
): Promise<ReturnType> {
  try {
    const response = await axios.delete(`/admin/users/${customerId}`);
    return ResponseGenerator(response);
  } catch (error) {
    return ErrorResponseGenerator(error);
  }
}
