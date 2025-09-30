import axios from "@/lib/axios";
import { ErrorResponseGenerator, ResponseGenerator } from "@/data/response";
import type { ReturnType } from "@/types/return-type";

export async function makeInvestmentReq(formData: {
  amountInvested: number;
  investmentPlanId: number;
}): Promise<ReturnType> {
  try {
    const response = await axios.post(`/investments`, formData);
    return ResponseGenerator(response);
  } catch (error) {
    return ErrorResponseGenerator(error);
  }
}
