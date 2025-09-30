"use client";

import { Loader } from "@/components/common/Loader";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import Separator from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { removeUserFromBlacklist } from "@/data/settings/removeUserFromBlacklist";
import axios from "@/lib/axios";
import { imageURL } from "@/lib/utils";
import { getAvatarFallback } from "@/utils/getAvatarFallback";
import { useParams } from "next/navigation";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import useSWR from "swr";
import { Blacklist, WithdrawEdit } from "./_components";

export const runtime = "edge"; // edge runtime layout

export default function WithdrawDetails() {
  const params = useParams(); // get customerId from params
  const { t } = useTranslation();

  // fetch user by id
  const { data, isLoading, mutate } = useSWR(
    `/admin/methods/${params.withdrawId}`,
    (u: string) => axios(u),
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-10">
        <Loader />
      </div>
    );
  }

  const handleRemoveFromBlacklist = (userId: number) => {
    const formData = {
      methodId: Number(params.withdrawId),
      userId,
    };
    toast.promise(removeUserFromBlacklist(formData, "methods"), {
      loading: t("Loading..."),
      success: (res) => {
        if (!res.status) throw new Error(res.message);
        mutate();
        return res.message;
      },
      error: (err) => err.message,
    });
  };

  const method = data?.data;

  const blackListedUserIds =
    method?.blackListedUsers?.map((user: any) => user.customer.userId) || [];

  return (
    <Accordion
      type="multiple"
      defaultValue={["withdrawDetails", "withdrawDetailsAllowed", "Blacklist"]}
    >
      {/* Withdraw details form */}
      <WithdrawEdit method={method} onMutate={mutate} />

      <AccordionItem
        value="Blacklist"
        className="mt-4 rounded-xl border border-border bg-background px-4 py-0"
      >
        <AccordionTrigger className="flex items-center justify-between py-6 hover:no-underline">
          <p className="text-base font-medium leading-[22px]">
            {t("Blacklist")}
          </p>
        </AccordionTrigger>
        <AccordionContent className="border-t pt-4">
          <div className="w-full max-w-[700px]">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-full"> {t("Name")} </TableHead>
                  <TableHead> {t("Action")} </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {method?.blackListedUsers.map((user: any) => (
                  <TableRow key={user?.id}>
                    <TableCell className="flex w-full items-center gap-2.5 py-2">
                      <Avatar>
                        <AvatarImage
                          src={imageURL(user?.customer.profileImage)}
                        />
                        <AvatarFallback>
                          {getAvatarFallback(user?.customer.name)}{" "}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <span className="block font-medium">
                          {user?.customer.name}
                        </span>
                        <span className="block text-xs">{user.email}</span>
                      </div>
                    </TableCell>

                    <TableCell className="py-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          handleRemoveFromBlacklist(user?.customer.userId)
                        }
                        className="rounded-lg"
                      >
                        {t("Unblock")}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <Separator className="mb-1 mt-[5px] bg-border" />

          <Blacklist
            methodId={Number(params.withdrawId)}
            onMutate={() => mutate(data)}
            blackListedUsers={blackListedUserIds}
          />
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
