import axios from "@/lib/axios";
import { ErrorResponseGenerator, ResponseGenerator } from "@/data/response";

type PostFormData = {
  name: string;
  value: string;
  countryCode: string;
  currencyCode: string;
  allowDeposit: boolean;
  allowWithdraw: boolean;
  requiredInput: boolean;
  inputType: string;
  otherName: string;
};

export async function createMethod(formData: PostFormData) {
  try {
    const res = await axios.post(`/agent-methods/create`, formData);
    return ResponseGenerator(res);
  } catch (error) {
    return ErrorResponseGenerator(error);
  }
}

export async function updateMethod(
  formData: PostFormData,
  id: string | number,
) {
  try {
    const res = await axios.put(`/agent-methods/${id}`, formData);
    return ResponseGenerator(res);
  } catch (error) {
    return ErrorResponseGenerator(error);
  }
}

export async function deleteMethod(id: string | number) {
  try {
    const res = await axios.delete(`/agent-methods/${id}`);
    return ResponseGenerator(res);
  } catch (error) {
    return ErrorResponseGenerator(error);
  }
}
