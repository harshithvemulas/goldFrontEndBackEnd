"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Copy } from "iconsax-react";
import { ReactElement } from "react";

export function WebhookDetails({
  title,
  trigger,
  body,
}: {
  title: string;
  trigger: ReactElement;
  body: string;
}) {
  const parsedBody = JSON.parse(body);
  return (
    <Dialog>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="flex h-full max-h-[90%] w-full max-w-[700px] flex-col">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <ScrollArea className="relative flex-1 rounded-lg bg-foreground/10 p-4">
          <Button
            variant="secondary"
            size="icon"
            className="absolute right-4 top-4 z-10 rounded-md shadow-default hover:bg-primary hover:text-primary-foreground"
          >
            <Copy size="20" />
          </Button>
          <pre>{JSON.stringify(parsedBody, null, 2)}</pre>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
