import axios from "@/lib/axios";
import { AxiosResponse, isAxiosError } from "axios";

export interface ReturnType {
  status: boolean;
  statusCode: number;
  statusText: string;
  message: string;
  data?: any;
  redirectUrl?: string;
  error?: any;
}

export async function makePaymentRequest<T extends Record<string, any>>(
  formData: T,
) {
  function ResponseGenerator(response: AxiosResponse): ReturnType {
    return {
      ...response.data,
      statusCode: response.status,
      statusText: response.statusText,
      status: response.status === 200 || response.status === 201,
      message: response.data?.message ?? "",
      data: response.data?.data,
      redirectUrl: response.data?.redirectUrl,
    };
  }

  function ErrorResponseGenerator(error: any): ReturnType {
    let statusCode = 500;
    let statusText = "Internal Server Error";
    let message = "An unknown error occurred";

    if (isAxiosError(error)) {
      statusCode = error.response?.status ?? 500;
      statusText = error.response?.statusText ?? "Internal Server Error";
      message =
        error.response?.data?.messages?.[0]?.message ??
        error.response?.data?.message ??
        error.message;
    } else if (error instanceof Error) {
      message = error.message;
    }
    return {
      statusCode,
      statusText,
      status: false,
      message,
      data: undefined,
      error,
    };
  }

  try {
    const res = await axios.post("/merchants/payment-requests", {
      amount: formData?.amount,
      currencyCode: formData?.currency,
      name: formData?.name,
      countryCode: formData?.country,
      email: formData?.email,
      address: formData?.address,
      feeByCustomer: formData?.feeByCustomer,
    });
    return ResponseGenerator(res);
  } catch (error) {
    return ErrorResponseGenerator(error);
  }
}
