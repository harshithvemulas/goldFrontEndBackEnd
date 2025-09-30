"use client";

import * as React from "react";

import { Case } from "@/components/common/Case";
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

import { Loader } from "@/components/common/Loader";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { deleteApiKey } from "@/data/settings/deleteApiKey";
import { regenerateApiKey } from "@/data/settings/regenerateApiKey";
import { copyContent } from "@/lib/utils";
import {
  DocumentCopy,
  Refresh2,
  Trash,
  Verify,
  WifiSquare,
} from "iconsax-react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { mutate } from "swr";

export default function APIPaymentSettings({ data }: { data: any }) {
  const [editMode, setEditMode] = React.useState(false);
  const [apiKey, setApiKey] = React.useState("");
  const [isPending, startTransition] = React.useTransition();

  const { t } = useTranslation();

  React.useEffect(() => {
    if (data) {
      setApiKey(data?.apiKey ?? "");
    }
  }, [data]);

  const reGenerateApiKey = () => {
    startTransition(async () => {
      const res = await regenerateApiKey();
      if (res && res.status) {
        mutate("/merchants/detail");
        toast.success(res.message);
      } else {
        toast.error(t(res.message));
      }
    });
  };

  const handleDeleteApiKey = async () => {
    const res = await deleteApiKey();
    if (res && res.status) {
      mutate("/merchants/detail");
      toast.success(res.message);
    } else {
      toast.error(t(res.message));
    }
  };

  return (
    <div className="rounded-xl border border-border bg-background">
      <AccordionItem value="API_KEY" className="border-none px-4 py-0">
        <AccordionTrigger className="py-6 hover:no-underline">
          <div className="flex items-center gap-1">
            <p className="text-base font-medium leading-[22px]">
              {t("API Key")}
            </p>
          </div>
        </AccordionTrigger>
        <AccordionContent className="flex flex-col gap-4 border-t border-divider px-1 pt-4">
          <Case condition={!editMode}>
            <Alert className="border-none bg-transparent shadow-default">
              <Verify
                size="32"
                variant="Bulk"
                color="#0B6A0B"
                className="-mt-1"
              />
              <AlertTitle className="ml-2.5 block text-sm font-semibold leading-5">
                {t("Introducing MPay API")}
              </AlertTitle>
              <AlertDescription className="ml-2.5 block text-sm font-normal">
                {t(
                  "Generate an API Key to start implementing our gateway. See documentation below for more.",
                )}
              </AlertDescription>
            </Alert>

            <div className="flex flex-wrap items-center gap-3">
              <Button
                type="button"
                onClick={() => setEditMode(true)}
                className="h-10 gap-2 rounded-lg px-4 py-2 text-base font-medium leading-[22px]"
              >
                <WifiSquare size="24" />
                {t("Show Key")}
              </Button>
            </div>
          </Case>

          {/* After generate an api key */}
          <Case condition={editMode}>
            <div className="inline-flex items-center gap-3">
              <Input
                type="text"
                readOnly
                value={apiKey}
                className="h-10 flex-1"
              />
              <Button
                type="button"
                onClick={() => copyContent(apiKey)}
                className="h-10 gap-2 rounded-lg px-4 py-2 text-base font-medium leading-[22px]"
              >
                <DocumentCopy size="24" />
                {t("Copy")}
              </Button>

              <Button
                variant="outline"
                onClick={reGenerateApiKey}
                disabled={isPending}
                className="h-10 gap-2 rounded-lg px-4 py-2 text-base font-medium leading-[22px]"
              >
                <Case condition={!isPending}>
                  <Refresh2 size="24" />
                  {t("Re-generate key")}
                </Case>
                <Case condition={isPending}>
                  <Loader title={t("Generating...")} />
                </Case>
              </Button>

              <Button
                variant="outline"
                type="button"
                onClick={handleDeleteApiKey}
                className="h-10 gap-2 rounded-lg px-4 py-2 text-base font-medium leading-[22px] text-foreground"
              >
                <Trash size="24" />
                {t("Delete Key")}
              </Button>
            </div>
          </Case>
        </AccordionContent>
      </AccordionItem>
    </div>
  );
}
