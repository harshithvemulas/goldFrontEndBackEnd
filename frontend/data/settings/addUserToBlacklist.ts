import axios from "@/lib/axios";
import { ErrorResponseGenerator, ResponseGenerator } from "@/data/response";

type FormData = {
  methodId?: number;
  gatewayId?: number;
  userId: number;
};

export const addUserToBlacklist = async (
  FormData: FormData,
  type: "methods" | "gateways",
) => {
  try {
    const res = await axios.post(`/admin/${type}/add-to-blacklist`, FormData);
    return ResponseGenerator(res);
  } catch (error) {
    return ErrorResponseGenerator(error);
  }
};
