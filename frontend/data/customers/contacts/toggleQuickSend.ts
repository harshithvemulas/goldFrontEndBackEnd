import axios from "@/lib/axios";
import { ErrorResponseGenerator, ResponseGenerator } from "@/data/response";

export async function toggleQuickSendContact(
  contactId: number | string,
  type: "add" | "remove",
) {
  try {
    const res = await axios.put(`/contacts/quicksend/${type}/${contactId}`, {});
    return ResponseGenerator(res);
  } catch (error) {
    return ErrorResponseGenerator(error);
  }
}
