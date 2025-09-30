import axios from "@/lib/axios";
import { ErrorResponseGenerator, ResponseGenerator } from "@/data/response";

export async function updateAgent(data: any) {
  try {
    const res = await axios.put("/agents/update", {
      occupation: data.occupation,
      whatsapp: data.whatsapp,
    });
    return ResponseGenerator(res);
  } catch (error) {
    return ErrorResponseGenerator(error);
  }
}
