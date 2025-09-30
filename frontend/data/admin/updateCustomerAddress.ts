import axios from "@/lib/axios";
import { ErrorResponseGenerator, ResponseGenerator } from "@/data/response";
import type { ReturnType } from "@/types/return-type";

export async function updateCustomerMailingAddress(
  formData: Record<string, unknown>,
  customerId: string | number,
): Promise<ReturnType> {
  try {
    const response = await axios.put(
      `/admin/customers/update-address/${customerId}`,
      {
        addressLine: formData.street,
        zipCode: formData.zipCode,
        countryCode: formData.country,
        city: formData.city,
      },
    );

    return ResponseGenerator(response);
  } catch (error) {
    return ErrorResponseGenerator(error);
  }
}
