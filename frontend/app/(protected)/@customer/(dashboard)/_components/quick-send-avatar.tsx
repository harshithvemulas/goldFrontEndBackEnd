import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DrawerTrigger } from "@/components/ui/drawer";
import { Skeleton } from "@/components/ui/skeleton";
import { imageURL } from "@/lib/utils";
import { getAvatarFallback } from "@/utils/getAvatarFallback";
import { Add } from "iconsax-react";
import Link from "next/link";
import { quickContacts, QuickContactType } from "../layout";

export default function QuickSendAvatars({
  contacts,
  contactsLoading,
}: {
  contacts?: QuickContactType[];
  contactsLoading: boolean;
}) {
  return (
    <div className="flex items-center gap-[15px]">
      {contactsLoading &&
        [...Array(4)].map((_, i) => (
          // eslint-disable-next-line react/no-array-index-key
          <Skeleton key={i} className="size-10 rounded-full sm:size-12" />
        ))}

      {quickContacts(contacts)?.map((c) => (
        <Link key={c.id} href={`/transfer?email=${c.contact.email}`}>
          <Avatar className="size-10 sm:size-12">
            <AvatarImage
              src={imageURL(c.contact.customer.profileImage)}
              alt={c.contact.customer.name}
            />
            <AvatarFallback>
              {getAvatarFallback(c.contact.customer.name)}
            </AvatarFallback>
          </Avatar>
        </Link>
      ))}

      <DrawerTrigger className="flex size-10 items-center justify-center rounded-full border-2 border-btn-outline-border sm:size-12">
        <Add size={20} />
      </DrawerTrigger>
    </div>
  );
}
