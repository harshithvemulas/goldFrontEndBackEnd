import DataTable from "@/components/common/DataTable";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { imageURL } from "@/lib/utils";
import { CustomerContact } from "@/types/contacts";
import { getAvatarFallback } from "@/utils/getAvatarFallback";
import { SortingState } from "@tanstack/react-table";
import parsePhoneNumber from "libphonenumber-js";
import React from "react";
import { useTranslation } from "react-i18next";
import ContactTableMenu from "./menu";

export default function ContactsTable({
  data,
  meta,
  isLoading,
}: {
  data: CustomerContact[];
  meta: any;
  isLoading: boolean;
}) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const { t } = useTranslation();

  return (
    <DataTable
      data={data ? [...data.map((d: any) => new CustomerContact(d))] : []}
      sorting={sorting}
      isLoading={isLoading}
      setSorting={setSorting}
      pagination={{
        total: meta?.total,
        page: meta?.currentPage,
        limit: meta?.perPage,
      }}
      structure={[
        {
          id: "name",
          header: t("Name"),
          cell: ({ row }) => {
            const data = row?.original;
            const { contact } = data;

            return (
              <div className="flex items-center gap-2">
                <Avatar className="size-8">
                  <AvatarImage
                    src={imageURL(contact.customer?.avatar)}
                    alt={contact.customer?.name}
                  />
                  <AvatarFallback>
                    {getAvatarFallback(contact.customer?.name)}
                  </AvatarFallback>
                </Avatar>
                <span className="block min-w-24 text-xs font-normal sm:text-sm">
                  {contact.customer?.name}
                </span>
              </div>
            );
          },
        },

        {
          id: "contact_number",
          header: t("Contact number"),
          cell: ({ row }) => {
            const data = row?.original;
            const { contact } = data;

            const phone = parsePhoneNumber(contact.customer?.phone);

            return (
              <span className="whitespace-nowrap text-xs font-normal sm:text-sm">
                {phone?.formatInternational()}
              </span>
            );
          },
        },

        {
          id: "email",
          header: t("Email"),
          cell: ({ row }) => {
            const data = row?.original;
            const { contact } = data;
            return (
              <span className="text-xs font-normal sm:text-sm">
                {contact?.email}
              </span>
            );
          },
        },

        {
          id: "menu",
          header: t("Menu"),
          cell: ({ row }) => {
            const data = row?.original;

            return <ContactTableMenu row={data} />;
          },
        },
      ]}
    />
  );
}
