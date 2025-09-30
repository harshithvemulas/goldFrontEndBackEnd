import axios from "@/lib/axios";
import { ErrorResponseGenerator, ResponseGenerator } from "@/data/response";

type TFormData = {
  method: string;
  amount: number;
  currencyCode: string;
  country: string;
};

export async function makeDepositRequest(formData: TFormData) {
  try {
    const res = await axios.post("/deposits/create", formData);
    return ResponseGenerator(res);
  } catch (error) {
    return ErrorResponseGenerator(error);
  }
}
