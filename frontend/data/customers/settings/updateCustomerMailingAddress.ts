import axios from "@/lib/axios";
import { isAxiosError } from "axios";

interface ReturnType {
  status: boolean;
  statusCode: number;
  statusText: string;
  message: string;
}

export async function updateCustomerMailingAddress(
  formData: Record<string, unknown>,
): Promise<ReturnType> {
  try {
    const response = await axios.put("/customers/update-address", {
      addressLine: formData.street,
      zipCode: formData.zipCode,
      countryCode: formData.country,
      city: formData.city,
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
    };
  }
}
