import axios from "@/lib/axios";
import { ErrorResponseGenerator, ResponseGenerator } from "@/data/response";
import type { ReturnType } from "@/types/return-type";

type TFormData = {
  amount: number;
  currencyCode: string;
  userId: number;
  keepRecords: boolean;
};

export async function updateUserBalance(
  formData: TFormData,
  type: "remove" | "add",
): Promise<ReturnType> {
  try {
    const response = await axios.post(`/admin/users/${type}-balance`, formData);
    return ResponseGenerator(response);
  } catch (error) {
    return ErrorResponseGenerator(error);
  }
}
