import axios from "@/lib/axios";
import { ErrorResponseGenerator, ResponseGenerator } from "@/data/response";
import type { ReturnType } from "@/types/return-type";

export async function deleteCard({
  cardId,
  isAdmin = false,
}: {
  cardId: string | number;
  isAdmin?: boolean;
}): Promise<ReturnType> {
  try {
    const response = await axios.delete(
      `${isAdmin ? "/admin/cards/" : "/cards/"}${cardId}`,
    );
    return ResponseGenerator(response);
  } catch (error) {
    return ErrorResponseGenerator(error);
  }
}
