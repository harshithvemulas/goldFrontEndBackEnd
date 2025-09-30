import axios from "@/lib/axios";
import { ErrorResponseGenerator, ResponseGenerator } from "@/data/response";

export async function deleteFavorite(id: string) {
  try {
    const res = await axios.put(`/saves/toggle-bookmark/${id}`, { id });
    return ResponseGenerator(res);
  } catch (error) {
    return ErrorResponseGenerator(error);
  }
}
