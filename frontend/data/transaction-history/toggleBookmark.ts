import axios from "@/lib/axios";
import { ErrorResponseGenerator, ResponseGenerator } from "@/data/response";

export async function toggleBookmark(id: string, url?: string) {
  try {
    const res = await axios.put(
      `${url ?? "/transactions/toggle-bookmark"}/${id}`,
      { id },
    );
    return ResponseGenerator(res);
  } catch (error) {
    return ErrorResponseGenerator(error);
  }
}
