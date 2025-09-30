import axios from "@/lib/axios";
import { isAxiosError } from "axios";

export async function logout(): Promise<{
  status: boolean;
  statusCode: number;
  statusText: string;
  message: string;
}> {
  try {
    const response = await axios.post("/auth/logout", {});
    await fetch("/api/auth/session", {
      method: "DELETE",
    });

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
