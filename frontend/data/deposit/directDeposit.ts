import axios from "@/lib/axios";
import { ErrorResponseGenerator, ResponseGenerator } from "@/data/response";

interface ReturnType {
  status: boolean;
  statusCode: number;
  statusText: string;
  message: string;
}

// customer mailing address update function
export async function directDeposit(
  formData: Record<string, any>,
): Promise<ReturnType> {
  try {
    const response = await axios.post(
      "/deposit-requests/direct-deposit/create",
      {
        currencyCode: formData.transferWalletId,
        amount: Number(formData.transferAmount),
        email: formData.email,
        countryCode: formData.country,
      },
    );

    return ResponseGenerator(response);
  } catch (error) {
    return ErrorResponseGenerator(error);
  }
}
