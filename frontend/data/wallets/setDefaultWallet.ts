import axios from "@/lib/axios";
import { isAxiosError } from "axios";

interface ReturnType {
  status: boolean;
  statusCode: number;
  statusText: string;
  message: string;
}

export async function setDefaultWallet(params: {
  walletId: number;
}): Promise<ReturnType> {
  try {
    const response = await axios.put(
      `/wallets/make-default/${params.walletId}`,
      params,
    );

    return {
      statusCode: response.status,
      statusText: response.statusText,
      status: response.status === 200,
      message: response.data?.message ?? "",
    };
  } catch (error) {
    let statusCode = 500;
    let statusText = "Internal Server Error";
    let message = "An unknown error occurred";

    if (isAxiosError(error)) {
      statusCode = error.response?.status ?? 500;
      statusText = error.response?.statusText ?? "Internal Server Error";
      message = error.response?.data?.message ?? error.message;
    } else if (error instanceof Error) {
      message = error.message;
    }

    return {
      statusCode,
      statusText,
      status: false,
      message,
    };
  }
}
