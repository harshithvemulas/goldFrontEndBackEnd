"use client";

import { Case } from "@/components/common/Case";
import { SearchBox } from "@/components/common/form/SearchBox";
import { Loader } from "@/components/common/Loader";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { addUserToBlacklist } from "@/data/settings/addUserToBlacklist";
import { removeUserFromBlacklist } from "@/data/settings/removeUserFromBlacklist";
import { useDeviceSize } from "@/hooks/useDeviceSize";
import axios from "@/lib/axios";
import { imageURL } from "@/lib/utils";
import { User } from "@/types/auth";
import { getAvatarFallback } from "@/utils/getAvatarFallback";
import { Add, ArrowLeft2 } from "iconsax-react";
import { useSearchParams } from "next/navigation";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import InfiniteScroll from "react-infinite-scroll-component";
import { toast } from "sonner";
import useSWRInfinite from "swr/infinite";

const PAGE_DATA_LIMIT = 25;

export function Blacklist({
  gatewayId,
  onMutate,
  blackListedUsers,
}: {
  gatewayId: number;
  onMutate: () => void;
  blackListedUsers: number[];
}) {
  const { t } = useTranslation();
  const { width } = useDeviceSize();
  const searchParams = useSearchParams();
  const [open, setOpen] = useState(false);
  const [search, setSearch] = React.useState(searchParams.get("search") ?? "");

  const { data, isLoading, size, setSize, mutate } = useSWRInfinite(
    (index) => {
      return `/admin/users?page=${index + 1}&limit=${PAGE_DATA_LIMIT}&search=${search}`;
    },
    (url: string) => axios.get(url),
  );

  // handle search query
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setSearch(e.target.value);
  };

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

  return (
    <Drawer
      open={open}
      onOpenChange={setOpen}
      direction={width < 640 ? "bottom" : "right"}
    >
      <DrawerTrigger asChild>
        <div className="pt-4">
          <Button variant="outline" className="gap-1 rounded-lg">
            <Add />
            {t("Add Customer")}
          </Button>
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
              {t("Customers")}
            </DrawerTitle>
            <DrawerDescription className="invisible absolute text-xs font-normal text-secondary-text">
              {t(
                "You can add customers to the block list to prevent them from using the platform.",
              )}
            </DrawerDescription>
          </DrawerHeader>
        </div>

        <div className="flex flex-col p-6 pt-0">
          <SearchBox
            value={search}
            onChange={handleSearch}
            iconPlacement="end"
            placeholder={t("Search...")}
            className="w-full"
          />
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
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-full"> {t("Name")} </TableHead>
                      <TableHead> {t("Action")} </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {flatArray(data)
                      ?.map((d: Record<string, unknown>) => new User(d))
                      ?.map((n: User) => (
                        <React.Fragment key={n.id}>
                          <CustomerRenderer
                            data={n}
                            gatewayId={gatewayId}
                            blackListedUsers={blackListedUsers}
                            onMutate={() => {
                              mutate();
                              onMutate();
                            }}
                          />
                        </React.Fragment>
                      ))}
                  </TableBody>
                </Table>
              </InfiniteScroll>
            </Case>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}

function CustomerRenderer({
  data,
  gatewayId,
  blackListedUsers,
  onMutate,
}: {
  data: User;
  gatewayId: number;
  blackListedUsers: number[];
  onMutate: () => void;
}) {
  const { t } = useTranslation();
  const customer = data?.customer;

  if (!customer) {
    return null;
  }

  const handleAddToBlacklist = (userId: number) => {
    const formData = {
      gatewayId,
      userId,
    };
    toast.promise(addUserToBlacklist(formData, "gateways"), {
      loading: t("Loading..."),
      success: (res) => {
        if (!res.status) throw new Error(res.message);
        onMutate();
        return res.message;
      },
      error: (err) => err.message,
    });
  };

  const handleRemoveFromBlacklist = (userId: number) => {
    const formData = {
      gatewayId,
      userId,
    };

    toast.promise(removeUserFromBlacklist(formData, "gateways"), {
      loading: t("Loading..."),
      success: (res) => {
        if (!res.status) throw new Error(res.message);
        onMutate();
        return res.message;
      },
      error: (err) => err.message,
    });
  };

  const isBlacklisted = blackListedUsers.includes(customer.id);

  return (
    <TableRow className="border-b border-border-primary">
      <TableCell className="flex w-full items-center gap-2.5 py-2">
        <Avatar>
          <AvatarImage src={imageURL(customer.avatar)} />
          <AvatarFallback> {getAvatarFallback(customer.name)} </AvatarFallback>
        </Avatar>
        <div>
          <span className="block font-medium">{customer.name}</span>
          <span className="block text-xs">{data.email}</span>
        </div>
      </TableCell>

      <TableCell className="py-2">
        <Button
          variant="outline"
          onClick={
            isBlacklisted
              ? () => handleRemoveFromBlacklist(customer.id)
              : () => handleAddToBlacklist(customer.id)
          }
          size="sm"
          className="rounded-lg"
        >
          {!isBlacklisted ? t("Add to blacklist") : t("Unblock user")}
        </Button>
      </TableCell>
    </TableRow>
  );
}
