import axios from "@/lib/axios";
import { ErrorResponseGenerator, ResponseGenerator } from "@/data/response";

export async function generateCard(walletId: string | number) {
  try {
    const res = await axios.post("/cards/generate-virtual", {
      walletId,
    });
    return ResponseGenerator(res);
  } catch (error) {
    return ErrorResponseGenerator(error);
  }
}
