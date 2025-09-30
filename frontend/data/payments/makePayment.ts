import axios from "@/lib/axios";
import { ErrorResponseGenerator, ResponseGenerator } from "@/data/response";

export async function makePayment<T extends Record<string, any>>(formData: T) {
  try {
    const res = await axios.post("/payments/create", {
      currencyCode: formData?.sender_wallet_id,
      amount: Number(formData?.amount),
      merchantId: formData?.receiver_merchant_id,
    });
    return ResponseGenerator(res);
  } catch (error) {
    return ErrorResponseGenerator(error);
  }
}
