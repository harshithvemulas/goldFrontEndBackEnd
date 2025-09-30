import axios from "@/lib/axios";
import { isAxiosError } from "axios";
import { format } from "date-fns";

interface ReturnType {
  status: boolean;
  statusCode: number;
  statusText: string;
  message: string;
}

export async function updateCustomerProfileInformation(
  formData: Record<string, any>,
): Promise<ReturnType> {
  try {
    const fd = new FormData();
    fd.append("firstName", formData.firstName);
    fd.append("lastName", formData.lastName);
    fd.append("phone", formData.phone);
    fd.append("gender", formData.gender);
    fd.append("dob", format(formData.dateOfBirth as Date, "yyyy-MM-dd"));
    fd.append("profileImage", formData.profileImage);

    const response = await axios.put("/customers/update", fd, {
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
    };
  }
}
