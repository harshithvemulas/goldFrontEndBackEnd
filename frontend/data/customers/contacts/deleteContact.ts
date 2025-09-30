import axios from "@/lib/axios";
import { ErrorResponseGenerator, ResponseGenerator } from "@/data/response";
import { ReturnType } from "@/types/return-type";

export async function deleteContact(contactId: string): Promise<ReturnType> {
  try {
    const response = await axios.delete(`/contacts/delete/${contactId}`);
    return ResponseGenerator(response);
  } catch (error) {
    return ErrorResponseGenerator(error);
  }
}
