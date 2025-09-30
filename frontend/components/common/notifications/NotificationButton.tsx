"use client";

import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { ArrowLeft2, Notification as NotificationIcon } from "iconsax-react";

import { Case } from "@/components/common/Case";
import { Loader } from "@/components/common/Loader";
import Separator from "@/components/ui/separator";
import {
  makeAllNotificationRead,
  makeNotificationRead,
} from "@/data/notifications";
import { useAuth } from "@/hooks/useAuth";
import { useDeviceSize } from "@/hooks/useDeviceSize";
import { useNotification } from "@/hooks/useNotification";
import axios from "@/lib/axios";
import { transmit } from "@/lib/tansmit";
import { Notification } from "@/types/notification";
import { notificationToast } from "@/utils/notificationToast";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import InfiniteScroll from "react-infinite-scroll-component";
import { toast } from "sonner";
import useSWRInfinite from "swr/infinite";

const PAGE_DATA_LIMIT = 25;

export default function NotificationButton() {
  const { unread, refreshUnread } = useNotification();
  const { t } = useTranslation();
  const { width } = useDeviceSize();
  const { auth } = useAuth();
  const [open, setOpen] = useState(false);

  const { data, isLoading, size, setSize, mutate } = useSWRInfinite(
    (index) => {
      return `/notifications?page=${index + 1}&limit=${PAGE_DATA_LIMIT}`;
    },
    (url: string) => axios.get(url),
  );

  // create ws instance
  React.useEffect(() => {
    (async () => {
      const subscription = transmit.subscription(`users/${auth?.id}`);
      await subscription.create();
      subscription.onMessage((res: Record<string, string | number>) => {
        refreshUnread();
        notificationToast(res);
      });

      return () => {
        subscription.delete();
      };
    })();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auth?.id]);

  const getDateLength = (data: any) => {
    return data?.reduce((a: number, c: any) => {
      return a + Number(c.data?.data?.length ?? 0);
    }, 0);
  };

  // get flat array
  const flatArray = (data: any) => {
    return data?.reduce((a: [], c: any) => {
      if (c?.data?.data?.length) {
        return [...a, ...c.data.data];
      }
      return a;
    }, []);
  };

  // handle mark all notification as read
  const handleMarkAllNotificationAsRead = async () => {
    const res = await makeAllNotificationRead();
    if (res?.status) {
      mutate(data);
      refreshUnread();
      toast.success(res.message);
    } else {
      toast.error(res.message);
    }
  };

  return (
    <Drawer
      open={open}
      onOpenChange={setOpen}
      direction={width < 640 ? "bottom" : "right"}
    >
      <DrawerTrigger className="relative flex h-12 w-12 items-center justify-center gap-2 rounded-2xl bg-secondary transition duration-300 ease-in-out hover:bg-secondary-500">
        <div className="relative">
          <span className="absolute -right-1.5 -top-1 flex h-4 w-4 origin-top-right items-center justify-center rounded-full bg-primary px-1 text-xs text-primary-foreground empty:hidden">
            {!Number.isNaN(unread?.total) && Number(unread?.total) !== 0
              ? unread?.total
              : null}
          </span>
          <NotificationIcon size="24" />
        </div>
      </DrawerTrigger>

      <DrawerContent className="inset-x-auto bottom-auto left-auto right-0 top-0 m-0 mt-20 flex h-full w-full max-w-[540px] flex-col rounded-t-none bg-background px-0 pt-4 sm:inset-y-0 sm:mt-0 sm:pt-8">
        <span className="mx-auto mb-8 block h-2.5 w-20 rounded-lg bg-divider-secondary sm:hidden" />

        <div className="flex items-center gap-4 px-6 pb-6">
          <Button
            variant="outline"
            size="icon"
            className="hidden sm:flex"
            asChild
          >
            <DrawerClose>
              <ArrowLeft2 size={16} />
            </DrawerClose>
          </Button>
          <DrawerHeader className="flex-1 p-0">
            <DrawerTitle className="text-left text-base font-semibold leading-[22px]">
              {t("Notifications")}
            </DrawerTitle>
            <DrawerDescription className="invisible absolute text-xs font-normal text-secondary-text">
              {t(
                "Stay updated with alerts and offers. Customize your notifications.",
              )}
            </DrawerDescription>
          </DrawerHeader>

          <Button
            variant="outline"
            onClick={handleMarkAllNotificationAsRead}
            className="rounded-lg px-4 py-2 text-sm font-medium leading-[22px] sm:text-base"
          >
            {t("Mark all as read")}
          </Button>
        </div>

        <div
          id="scrollbarTrigger"
          className="flex-1 overflow-y-auto overflow-x-hidden"
        >
          <div className="flex flex-col gap-2 p-6 pt-0">
            <Case condition={isLoading}>
              <div className="flex items-center justify-center py-10">
                <Loader />
              </div>
            </Case>

            <Case condition={!isLoading && !!data?.length}>
              <InfiniteScroll
                dataLength={getDateLength(data)}
                next={() => setSize(size + 1)}
                hasMore={!!data?.[data.length - 1]?.data?.meta?.nextPageUrl}
                loader={<Loader className="flex justify-center py-4" />}
                endMessage={
                  <p className="py-4" style={{ textAlign: "center" }}>
                    <b>{t("No more")}</b>
                  </p>
                }
                scrollableTarget="scrollbarTrigger"
              >
                {flatArray(data)
                  ?.map((d: Record<string, unknown>) => new Notification(d))
                  ?.map((n: Notification) => (
                    <React.Fragment key={n.id}>
                      <NotificationRenderer
                        data={n}
                        mutate={() => mutate(data)}
                        close={() => setOpen(false)}
                        refreshUnread={refreshUnread}
                      />
                      <Separator className="mb-1 mt-[5px] bg-divider" />
                    </React.Fragment>
                  ))}
              </InfiniteScroll>
            </Case>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}

function NotificationRenderer({
  data,
  mutate,
  refreshUnread,
  close,
}: {
  data: Notification;
  mutate: () => void;
  refreshUnread: () => void;
  close: () => void;
}) {
  const router = useRouter();

  return (
    <div
      data-read={data.isRead}
      role="presentation"
      onClick={async () => {
        if (!data.isRead) {
          const res = await makeNotificationRead(data.id);
          if (res?.status) {
            refreshUnread();
            mutate();
          }
        }
        router.push(`/${data?.navigate}`);
        close();
      }}
      className="flex w-full cursor-pointer items-center gap-2 border-l-4 border-primary bg-background py-1.5 pl-2 hover:bg-accent data-[read=true]:border-transparent"
    >
      <div className="flex-1">
        <h6 className="mb-1 text-sm font-semibold leading-5">{data.title}</h6>
        <p className="mb-1 p-0 text-xs font-normal leading-4 text-foreground">
          {data.body}
        </p>
        {data?.createdAt ? (
          <p className="flex items-center gap-0.5 p-0 text-xs text-secondary-text">
            {format(data.createdAt, "hh:mm a")}
            <span className="block size-1 rounded-full bg-secondary-text" />
            <span>{format(data.createdAt, "MMM dd, yyyy")}</span>
          </p>
        ) : null}
      </div>
    </div>
  );
}
