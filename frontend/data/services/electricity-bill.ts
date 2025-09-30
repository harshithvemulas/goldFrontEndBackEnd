import axios from "@/lib/axios";
import { ErrorResponseGenerator, ResponseGenerator } from "@/data/response";

interface TFormData extends Record<string, any> {
  meterNumber: string;
  amount: number;
  currencyCode: string;
  billerId: number;
}

export async function previewElectricityBill(formData: TFormData) {
  try {
    const res = await axios.post("/services/utility/preview", formData);
    return ResponseGenerator(res);
  } catch (error) {
    return ErrorResponseGenerator(error);
  }
}
export async function createElectricityBill(formData: TFormData) {
  try {
    const res = await axios.post("/services/utility/create", formData);
    return ResponseGenerator(res);
  } catch (error) {
    return ErrorResponseGenerator(error);
  }
}
