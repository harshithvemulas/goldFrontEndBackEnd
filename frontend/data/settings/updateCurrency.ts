import axios from "@/lib/axios";
import { ErrorResponseGenerator, ResponseGenerator } from "@/data/response";

type FormData = {
  name: string;
  code: string;
  minAmount: string;
  maxAmount: string;
  dailyTransferAmount: string;
  dailyTransferLimit: string;
  kycLimit?: string | null;
  notificationLimit?: string | null;
  acceptApiRate?: number;
  usdRate?: string;
  isCrypto?: number;
};

export const updateCurrency = async (formData: FormData, id: number) => {
  try {
    const res = await axios.put(`/admin/currencies/update/${id}`, formData);
    return ResponseGenerator(res);
  } catch (error) {
    return ErrorResponseGenerator(error);
  }
};
