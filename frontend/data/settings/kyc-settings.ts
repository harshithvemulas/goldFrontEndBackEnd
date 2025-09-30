import axios from "@/lib/axios";
import { ErrorResponseGenerator, ResponseGenerator } from "@/data/response";

export const kycAcceptDecline = async (
  id: string | number,
  type: "accept" | "decline",
) => {
  try {
    const res = await axios.put(`/admin/kycs/${type}/${id}`, {});
    return ResponseGenerator(res);
  } catch (error) {
    return ErrorResponseGenerator(error);
  }
};
