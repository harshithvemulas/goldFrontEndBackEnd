import axios from "@/lib/axios";
import { isAxiosError } from "axios";

interface ReturnType extends Record<string, any> {
  status: boolean;
  statusCode: number;
  statusText: string;
  message: string;
}

export async function updateCustomerKycDocument(
  formData: Record<string, any>,
): Promise<ReturnType> {
  try {
    const fd = new FormData();
    fd.append("documentType", formData.documentType);
    fd.append("front", formData.documentFrontSide);
    fd.append("back", formData.documentBackSide);
    fd.append("selfie", formData.selfie);

    const response = await axios.post("/kycs/submit", fd, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return {
      statusCode: response.status,
      statusText: response.statusText,
      status: response.status === 200 || response.status === 201,
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
      error,
    };
  }
}
