import axios from "@/lib/axios";
import { ErrorResponseGenerator, ResponseGenerator } from "@/data/response";

type TFormData = {
  agentId: string;
  method: string;
  inputValue: string;
  amount: number;
  currencyCode: string;
  countryCode: string;
};

export async function makeAgentDepositRequest(formData: TFormData) {
  try {
    const res = await axios.post("/deposit-requests/create", formData);
    return ResponseGenerator(res);
  } catch (error) {
    return ErrorResponseGenerator(error);
  }
}
