import axios from "@/lib/axios";
import { ErrorResponseGenerator, ResponseGenerator } from "@/data/response";

type TFormData = {
  depositCharge: number | null;
  withdrawalCharge: number | null;
  depositCommission: number | null;
  withdrawalCommission: number | null;
};

export async function updateCommission(formData: TFormData) {
  try {
    const res = await axios.put("/agents/update-fees-commissions", formData);
    return ResponseGenerator(res);
  } catch (error) {
    return ErrorResponseGenerator(error);
  }
}
