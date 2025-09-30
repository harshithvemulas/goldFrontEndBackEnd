import axios from "@/lib/axios";
import { ErrorResponseGenerator, ResponseGenerator } from "@/data/response";
import type { ReturnType } from "@/types/return-type";

type FormData = {
  status: string;
};

export async function updateCardStatus({
  cardId,
  dataList,
  isAdmin = false,
}: {
  cardId: string | number;
  dataList: FormData;
  isAdmin?: boolean;
}): Promise<ReturnType> {
  try {
    const response = await axios.put(
      `${isAdmin ? "/admin/cards/change-status/" : "/cards/change-status/"}${cardId}`,
      dataList,
    );
    return ResponseGenerator(response);
  } catch (error) {
    return ErrorResponseGenerator(error);
  }
}
