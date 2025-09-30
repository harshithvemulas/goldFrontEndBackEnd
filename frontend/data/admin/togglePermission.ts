import axios from "@/lib/axios";
import { ErrorResponseGenerator, ResponseGenerator } from "@/data/response";
import type { ReturnType } from "@/types/return-type";

export type Permission =
  | "deposit"
  | "withdraw"
  | "payment"
  | "exchange"
  | "transfer"
  | "services"
  | "addAccount"
  | "addRemoveBalance";

export async function togglePermission(
  formData: {
    permission: Permission;
    status: boolean;
  },
  customerId: string | number,
): Promise<ReturnType> {
  try {
    const response = await axios.put(
      `/admin/users/permission/${customerId}`,
      formData,
    );

    return ResponseGenerator(response);
  } catch (error) {
    return ErrorResponseGenerator(error);
  }
}
