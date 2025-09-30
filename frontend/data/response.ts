import { ReturnType } from "@/types/return-type";
import { AxiosResponse, isAxiosError } from "axios";

export function ResponseGenerator(response: AxiosResponse): ReturnType {
  return {
    ...response.data,
    statusCode: response.status,
    statusText: response.statusText,
    status: response.status === 200 || response.status === 201,
    message: response.data?.message ?? "",
    data: response.data?.data,
  };
}

export function ErrorResponseGenerator(error: any): ReturnType {
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
