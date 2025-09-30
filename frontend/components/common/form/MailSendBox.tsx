"use client";

import { Case } from "@/components/common/Case";
import { Loader } from "@/components/common/Loader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Label from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { sendSupportEmail } from "@/data/contacts/support-email";
import { Paperclip2, Send2, Trash } from "iconsax-react";
import Image from "next/image";
import React, { useState, useTransition } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

type FormData = {
  subject: string;
  message: string;
  attachments?: File[];
};

export function MailSendBox() {
  const { t } = useTranslation();
  const [isPending, startTransition] = useTransition();
  const [formData, setFormData] = useState<FormData>({
    subject: "",
    message: "",
    attachments: [],
  });

  // handle form input data change
  const handleFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    e.preventDefault();

    if (e.target.type === "file") {
      const target = e.target as HTMLInputElement;
      if (target.files && target.files.length > 0) {
        setFormData((prev) => ({
          ...prev,
          attachments: [
            ...(prev.attachments || []),
            ...Array.from(target.files as FileList),
          ],
        }));
      }
    } else {
      setFormData((prev) => ({
        ...prev,
        [e.target.name]: e.target.value,
      }));
    }
  };

  // remove attachment
  const removeAttachment = (file: File) => {
    setFormData((prev) => {
      const newAttachments = prev.attachments?.filter(
        (f: File) => f.name !== file.name || f.size !== file.size,
      );
      return {
        ...prev,
        attachments: newAttachments,
      };
    });
  };

  //  Render preview
  const renderPreview = (files?: File[]): React.ReactElement | null => {
    if (!files || files?.length === 0) return null;

    const filesGroup = Object.groupBy(files, (file) =>
      file.type.startsWith("image/") ? "images" : "others",
    );

    return (
      <>
        {Object.prototype.hasOwnProperty.call(filesGroup, "images") && (
          <div className="flex flex-wrap items-center gap-2 [&img]:aspect-square [&img]:max-w-28">
            {filesGroup?.images?.map((file: File, index: number) => (
              // eslint-disable-next-line react/no-array-index-key
              <div className="group relative flex" key={index}>
                <Image
                  src={URL.createObjectURL(file)}
                  alt={file.name}
                  width={128}
                  height={128}
                  loading="lazy"
                  className="t-fill h-28 w-28 rounded-xl border"
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  onClick={() => removeAttachment(file)}
                  className="pointer-events-none invisible absolute right-1 top-1 size-7 group-hover:pointer-events-auto group-hover:visible"
                >
                  <Trash size={15} />
                </Button>
              </div>
            ))}
          </div>
        )}
        {Object.prototype.hasOwnProperty.call(filesGroup, "others") && (
          <ul className="list-inside list-disc">
            {filesGroup?.others?.map((file) => (
              <li className="group text-sm" key={file.name + file.lastModified}>
                {file.name}
                <Button
                  type="button"
                  variant="link"
                  size="icon"
                  onClick={() => removeAttachment(file)}
                  className="pointer-events-none invisible size-7 group-hover:pointer-events-auto group-hover:visible"
                >
                  <Trash size={15} />
                </Button>
              </li>
            ))}
          </ul>
        )}
      </>
    );
  };

  // send email
  const handleSendEmail = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData();
    fd.append("subject", formData.subject);
    fd.append("message", formData.message);
    // Append each attachment to the FormData
    formData.attachments?.forEach((file) => {
      fd.append("attachments[]", file);
    });

    startTransition(async () => {
      const res = await sendSupportEmail(fd);
      if (res?.status) toast.success(res.message);
      else toast.success(res.message);
    });
  };

  return (
    <form onSubmit={handleSendEmail} className="flex flex-col gap-4">
      <div className="flex flex-col space-y-2">
        <Label>{t("Subject")}</Label>
        <Input
          name="subject"
          type="text"
          value={formData.subject}
          onChange={handleFormChange}
        />
      </div>

      <div className="flex flex-col space-y-2">
        <Label>{t("Message")}</Label>
        <Textarea
          name="message"
          rows={20}
          value={formData.message}
          onChange={handleFormChange}
        />
      </div>

      <div className="relative w-full">
        {/* attachment views */}
        <Case condition={formData?.attachments?.length !== 0}>
          <div className="mb-4 flex flex-col gap-3 rounded-md border bg-input p-4">
            {renderPreview(formData.attachments)}
          </div>
        </Case>

        {/* actions */}
        <div className="flex">
          <Button disabled={isPending} type="submit" className="w-fit min-w-32">
            <Case condition={!isPending}>
              <Send2 />
              {t("Send")}
            </Case>
            <Case condition={isPending}>
              <Loader
                title={t("Sending...")}
                className="text-primary-foreground"
              />
            </Case>
          </Button>

          <Button
            type="button"
            variant="link"
            className="cursor-pointer gap-1 text-secondary-text hover:text-foreground"
            asChild
          >
            <Label htmlFor="attachments">
              <Paperclip2 />
              {t("Attachment")}
              <Input
                id="attachments"
                type="file"
                multiple
                name="attachments"
                onChange={handleFormChange}
                className="hidden"
              />
            </Label>
          </Button>
        </div>
      </div>
    </form>
  );
}
