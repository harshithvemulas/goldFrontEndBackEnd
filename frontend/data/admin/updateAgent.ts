import axios from "@/lib/axios";
import { ErrorResponseGenerator, ResponseGenerator } from "@/data/response";
import type { ReturnType } from "@/types/return-type";

export type TFormData = {
  occupation: string;
  whatsapp: string;
  agentId: string;
  processingTime: string;
  email?: string;
  name?: string;
  addressLine?: string;
  zipCode?: string;
  countryCode?: string;
  city?: string;
};

/**
 * Updates the information of an agent based on the provided form data.
 *
 * @param formData - The data to update, extending TFormData.
 * @param customerId - The unique identifier for the agent being updated.
 *
 * @returns A Promise that resolves to ReturnType, representing the response
 *          from the server or an error response if the request fails.
 */
export async function updateAgentInformation(
  formData: TFormData,
  customerId: string | number,
): Promise<ReturnType> {
  try {
    const response = await axios.put(
      `/admin/agents/update/${customerId}`,
      formData,
    );

    return ResponseGenerator(response);
  } catch (error) {
    return ErrorResponseGenerator(error);
  }
}
