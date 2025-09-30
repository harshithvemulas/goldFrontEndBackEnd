import axios from "@/lib/axios";
import { ErrorResponseGenerator, ResponseGenerator } from "@/data/response";
import type { ReturnType } from "@/types/return-type";

export async function deleteInvestment(
  investmentId: string | number,
): Promise<ReturnType> {
  try {
    const response = await axios.delete(`/admin/investments/${investmentId}`);

    return ResponseGenerator(response);
  } catch (error) {
    return ErrorResponseGenerator(error);
  }
}
