import axios from "@/lib/axios";
import { ErrorResponseGenerator, ResponseGenerator } from "@/data/response";
import type { ReturnType } from "@/types/return-type";

type TFormData = {
  key: string;
  value1: "on" | "off";
  value2: string | null;
};

export async function updateServices(formData: TFormData): Promise<ReturnType> {
  try {
    const response = await axios.post("/admin/settings", formData);
    return ResponseGenerator(response);
  } catch (error) {
    return ErrorResponseGenerator(error);
  }
}
