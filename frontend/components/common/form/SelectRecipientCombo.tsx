"use client";

import { Loader } from "@/components/common/Loader";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useSWR } from "@/hooks/useSWR";
import cn, { imageURL } from "@/lib/utils";
import { TickCircle } from "iconsax-react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

export default function SelectRecipientCombo({
  user,
  onChange,
  setUser,
}: {
  onChange: (value: string) => void;
  setUser: any;
  user: any;
}) {
  const { t } = useTranslation();
  const [selected, setSelected] = useState<string>("");
  const [open, setOpen] = useState(false);
  const searchParams = useSearchParams();

  const { data, isLoading } = useSWR("/contacts?limit=500");
  const spContact = searchParams.get("contact");

  useEffect(() => {
    if (user) {
      setSelected(user?.name);
    }
  }, [user]);

  useEffect(() => {
    if (spContact) {
      const u = data?.data?.find(
        (c: Record<string, any>) => c.id?.toString() === spContact,
      );

      if (u) {
        setSelected(u.contact?.customer?.name);
        onChange(u.contactId?.toString());
        setUser({
          id: u.contact?.customer?.id,
          avatar: u.contact?.customer?.profileImage,
          name: u.contact?.customer?.name,
          email: u.contact?.email,
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [spContact, isLoading]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger className="h-12 w-full rounded-lg bg-input px-3 py-2 text-left text-input-placeholder">
        {selected ? (
          <span className="text-foreground">{selected}</span>
        ) : (
          <span className="text-input-placeholder">
            {t("Enter recipient account")}
          </span>
        )}
      </PopoverTrigger>
      <PopoverContent
        className="w-[var(--radix-popover-trigger-width)] p-0"
        align="start"
      >
        <Command>
          <CommandInput placeholder={t("Search...")} />
          <CommandList>
            <CommandEmpty>{t("No contact found.")}</CommandEmpty>
            {isLoading && (
              <div className="w-full px-2.5 py-2">
                <Loader />
              </div>
            )}
            <CommandGroup>
              {data?.data?.map((contact: Record<string, any>) => (
                <CommandItem
                  key={contact.id}
                  value={contact.contact?.customer?.name}
                  onSelect={() => {
                    setSelected(contact.contact?.customer?.name);
                    onChange(contact.contactId?.toString());
                    setUser({
                      id: contact.contact?.customer?.id,
                      avatar: contact.contact?.customer?.profileImage,
                      name: contact.contact?.customer?.name,
                      email: contact.contact?.email,
                    });
                    setOpen(false);
                  }}
                >
                  <Item
                    title={contact.contact?.customer?.name}
                    avatar={imageURL(contact.contact?.customer?.profileImage)}
                    email={contact.contact?.email}
                    checked={contact.contact?.customer?.name === selected}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

function Item({
  title,
  avatar,
  email,
  checked = false,
}: {
  title: string;
  avatar?: string;
  email: string;
  checked?: boolean;
}) {
  const { t } = useTranslation();
  return (
    <div className="flex w-full items-center gap-3 px-2.5 py-1">
      <div className="size-10 overflow-hidden rounded-md bg-muted">
        {avatar && (
          <Image
            src={avatar}
            alt={title}
            width={32}
            height={32}
            className="size-10"
          />
        )}
      </div>

      <div className="flex flex-1 flex-col gap-1">
        <h6>{title}</h6>
        <p className="block"> {email} </p>
      </div>

      <div
        className={cn(
          "flex items-center gap-1 px-2 text-xs opacity-0",
          checked && "opacity-100",
        )}
      >
        <TickCircle size={16} variant="Bold" className="text-success" />
        {t("Selected")}
      </div>
    </div>
  );
}
