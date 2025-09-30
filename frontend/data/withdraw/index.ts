import axios from "@/lib/axios";
import { ErrorResponseGenerator, ResponseGenerator } from "@/data/response";

type WithdrawAgentFormData = {
  agentId: string;
  method: string;
  inputValue: string;
  amount: number;
  currencyCode: string;
  countryCode: string;
  [key: string]: any;
};

export async function makeWithdrawRequestByAgent(
  formData: WithdrawAgentFormData,
) {
  try {
    const res = await axios.post(`/withdraw-requests/create`, formData);
    return ResponseGenerator(res);
  } catch (error) {
    return ErrorResponseGenerator(error);
  }
}

// Regular withdraw
type WithdrawFormData = {
  method: string;
  amount: number;
  currencyCode: string;
  country: string;
  [key: string]: string | number;
};

export async function makeWithdrawRequest(formData: WithdrawFormData) {
  try {
    const res = await axios.post(`/withdraws/create`, formData);
    return ResponseGenerator(res);
  } catch (error) {
    return ErrorResponseGenerator(error);
  }
}
