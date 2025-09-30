import axios from "@/lib/axios";
import { ErrorResponseGenerator, ResponseGenerator } from "@/data/response";
import type { ReturnType } from "@/types/return-type";
import { format } from "date-fns";

export async function updateCustomerProfileInformation(
  formData: Record<string, any>,
  userId: string | number,
): Promise<ReturnType> {
  try {
    const fd = new FormData();
    fd.append("firstName", formData.firstName);
    fd.append("lastName", formData.lastName);
    fd.append("email", formData.email);
    fd.append("phone", formData.phone);
    fd.append("gender", formData.gender);
    fd.append("dob", format(formData.dateOfBirth as Date, "yyyy-MM-dd"));
    fd.append("profileImage", formData.profile ?? "");

    const response = await axios.put(`/admin/customers/update/${userId}`, fd, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return ResponseGenerator(response);
  } catch (error) {
    return ErrorResponseGenerator(error);
  }
}
