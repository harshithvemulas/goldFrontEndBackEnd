import axios from "@/lib/axios";
import { ErrorResponseGenerator, ResponseGenerator } from "@/data/response";

interface ReturnType {
  status: boolean;
  statusCode: number;
  statusText: string;
  message: string;
}

export async function transferCredit(
  formData: Record<string, any>,
): Promise<ReturnType> {
  try {
    const response = await axios.post("/transfers/create", formData);

    return ResponseGenerator(response);
  } catch (error) {
    return ErrorResponseGenerator(error);
  }
}
