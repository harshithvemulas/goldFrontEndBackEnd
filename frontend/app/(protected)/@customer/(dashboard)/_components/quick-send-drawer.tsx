import { SearchBox } from "@/components/common/form/SearchBox";
import { Loader } from "@/components/common/Loader";
import { Button } from "@/components/ui/button";
import {
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerTitle,
} from "@/components/ui/drawer";
import { ScrollArea } from "@/components/ui/scroll-area";
import Separator from "@/components/ui/separator";
import { ArrowLeft2 } from "iconsax-react";
import { useTranslation } from "react-i18next";
import { QuickContactType } from "../layout";
import QuickSendItem from "./quick-send-item";

export default function QuickSendDrawer({
  search,
  setSearch,
  contacts,
  contactsLoading,
  onToggle,
}: {
  search: string;
  setSearch: (val: string) => void;
  contacts?: QuickContactType[];
  contactsLoading: boolean;
  onToggle: (id: string | number, type: "add" | "remove") => void;
}) {
  const { t } = useTranslation();

  return (
    <DrawerContent className="flex h-full w-[95%] flex-col rounded-t-none bg-white px-0 py-8 md:w-[400px]">
      <DrawerTitle className="flex items-center gap-2.5 px-6">
        <Button
          variant="outline"
          size="icon"
          className="h-10 w-10 rounded-lg"
          asChild
        >
          <DrawerClose>
            <ArrowLeft2 />
          </DrawerClose>
        </Button>
        <span className="text-base font-semibold">{t("Quick Send")}</span>
      </DrawerTitle>
      <DrawerDescription className="hidden" />

      <div className="flex flex-1 flex-col">
        {/* Search */}
        <div className="px-6 py-4">
          <SearchBox
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            iconPlacement="end"
            className="h-10 rounded-lg bg-accent"
            placeholder={t("Search...")}
          />
        </div>

        <ScrollArea className="flex-1 px-6 pb-8">
          {/* Quick send contacts */}
          <div className="flex flex-col gap-4">
            {contactsLoading && <Loader className="mx-2" />}
            {contacts?.map(
              (c: any) =>
                c.quickSend && (
                  <QuickSendItem
                    key={c.id}
                    id={c.id}
                    name={c.contact.customer.name}
                    email={c.contact.email}
                    checked
                    onSelect={(id) => onToggle(id, "remove")}
                  />
                ),
            )}
          </div>

          <Separator className="my-4" />

          {/* All contacts */}
          <div className="flex flex-col gap-y-4">
            <div>
              <h5 className="text-base font-semibold text-foreground">
                {t("Contacts")}
              </h5>
              <p className="text-xs text-secondary-text">
                {t(
                  "Select up to 5 contacts to add them in the Quick Send list.",
                )}
              </p>
            </div>
            {contactsLoading && <Loader className="mx-2" />}
            {contacts?.map(
              (c: any) =>
                !c.quickSend && (
                  <QuickSendItem
                    key={c.id}
                    id={c.id}
                    name={c.contact.customer.name}
                    email={c.contact.email}
                    onSelect={(id) => onToggle(id, "add")}
                  />
                ),
            )}
          </div>
        </ScrollArea>
      </div>
    </DrawerContent>
  );
}
