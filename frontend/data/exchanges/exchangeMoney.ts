import axios from "@/lib/axios";
import { ErrorResponseGenerator, ResponseGenerator } from "@/data/response";

export async function exchangeMoney(formData: Record<string, any>) {
  try {
    const res = await axios.post("/exchanges/create-request", {
      currencyFrom: formData.currencyFrom,
      currencyTo: formData.currencyTo,
      amountFrom: Number(formData.amount),
    });

    return ResponseGenerator(res);
  } catch (error) {
    return ErrorResponseGenerator(error);
  }
}
