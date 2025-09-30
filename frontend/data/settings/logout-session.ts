import axios from "@/lib/axios";
import { ErrorResponseGenerator, ResponseGenerator } from "@/data/response";

export async function logoutOtherDevice(id: string | number) {
  try {
    const res = await axios.put(`/login-sessions/remove/${id}`, {});
    return ResponseGenerator(res);
  } catch (error) {
    return ErrorResponseGenerator(error);
  }
}

export async function logoutAllOtherDevice() {
  try {
    const res = await axios.put(`/login-sessions/remove-all`, {});
    return ResponseGenerator(res);
  } catch (error) {
    return ErrorResponseGenerator(error);
  }
}
