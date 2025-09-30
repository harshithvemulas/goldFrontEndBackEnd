"use client";

import { useSWR } from "./useSWR";

export function useNotification() {
  const {
    data: unread,
    isLoading: isLoadingUnread,
    mutate: refreshUnread,
  } = useSWR("/notifications/count/unread-all");

  return {
    unread: unread?.data,
    isLoadingUnread,
    refreshUnread,
  };
}
