import axios from "@/lib/axios";
import { ErrorResponseGenerator, ResponseGenerator } from "@/data/response";

// Make all notification as read
export async function makeAllNotificationRead() {
  try {
    const res = await axios.post("/notifications/mark-all-as-read", {});
    return ResponseGenerator(res);
  } catch (error) {
    return ErrorResponseGenerator(error);
  }
}

// make a notification as read
export async function makeNotificationRead(notificationId: number) {
  try {
    const res = await axios.post(
      `/notifications/${notificationId}/mark-as-read`,
      {},
    );
    return ResponseGenerator(res);
  } catch (error) {
    return ErrorResponseGenerator(error);
  }
}
