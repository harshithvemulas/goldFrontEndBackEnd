import axios from "@/lib/axios";
import { ErrorResponseGenerator, ResponseGenerator } from "@/data/response";
import type { ReturnType } from "@/types/return-type";

export async function updateAgentAccess(
  customerId: string | number,
  status: "accept" | "decline",
): Promise<ReturnType> {
  try {
    const response = await axios.put(
      `/admin/agents/${status}/${customerId}`,
      {},
    );
    return ResponseGenerator(response);
  } catch (error) {
    return ErrorResponseGenerator(error);
  }
}
