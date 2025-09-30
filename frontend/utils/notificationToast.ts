import { toast } from "sonner";

export function notificationToast(res: Record<string, string | number>) {
  switch (res.type as string) {
    case "deposit_failed":
      return toast.error(res.title, { description: res.body });
    case "deposit_completed":
      return toast.success(res.title, { description: res.body });
    case "new_device_login":
      return toast.info(res.title, { description: res.body });
    default:
      return toast.message(res.title, { description: res.body });
  }
}
