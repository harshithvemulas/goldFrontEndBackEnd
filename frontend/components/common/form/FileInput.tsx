"use client";

import cn from "@/lib/utils";
import Image from "next/image";
import React from "react";
import { useDropzone } from "react-dropzone";

export function FileInput({
  defaultValue,
  onChange,
  className,
  children,
  disabled = false,
  id,
}: {
  defaultValue?: string;
  onChange: (file: File) => void;
  className?: string;
  children?: React.ReactNode;
  disabled?: boolean;
  id?: string;
}) {
  const [preview, setPreview] = React.useState<string | undefined>(
    defaultValue,
  );

  React.useEffect(() => {
    setPreview(defaultValue);
  }, [defaultValue]);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop: (files: File[]) => {
      const file = files?.[0];
      if (file) {
        onChange(file);
        setPreview(URL.createObjectURL(file));
      }
    },
    disabled,
  });

  return (
    <div
      {...getRootProps({
        className: cn(
          "relative flex h-48 w-full rounded-md border border-input bg-secondary px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          className,
        ),
      })}
    >
      {!!preview && (
        <Image
          src={preview}
          alt="preview"
          width={400}
          height={400}
          className="pointer-events-none absolute inset-0 left-0 top-0 h-full w-full object-contain"
        />
      )}
      <input id={id} {...getInputProps()} />
      {!preview && <div>{children}</div>}
    </div>
  );
}
