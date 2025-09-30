import axios from "@/lib/axios";
import { ErrorResponseGenerator, ResponseGenerator } from "@/data/response";
import type { ReturnType } from "@/types/return-type";

export async function updateInvestment(
  investmentId: string | number,
  formData: Record<string, unknown>,
): Promise<ReturnType> {
  try {
    const response = await axios.put(
      `/admin/investments/${investmentId}`,
      formData,
    );

    return ResponseGenerator(response);
  } catch (error) {
    return ErrorResponseGenerator(error);
  }
}
