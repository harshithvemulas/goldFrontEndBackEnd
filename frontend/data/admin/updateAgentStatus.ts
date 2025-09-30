import axios from "@/lib/axios";
import { ErrorResponseGenerator, ResponseGenerator } from "@/data/response";
import type { ReturnType } from "@/types/return-type";

type FormData = {
  isSuspend: boolean;
  isRecommended: boolean;
};

export async function updateAgentStatus(
  customerId: string | number,
  dataList: FormData,
): Promise<ReturnType> {
  try {
    const response = await axios.put(
      `/admin/agents/update-status/${customerId}`,
      dataList,
    );
    return ResponseGenerator(response);
  } catch (error) {
    return ErrorResponseGenerator(error);
  }
}
