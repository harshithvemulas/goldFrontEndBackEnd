"use client";

import Image from "next/image";
import { useTranslation } from "react-i18next";
import { Badge } from "../ui/badge";

interface IProps {
  logo: string;
  type: string;
  name: string;
  fee: string;
  isRecommended: boolean;
  defaultSelect: string;
  onSelect: (methodType: string) => void;
}

export function PayMethodCard({
  logo,
  type,
  name,
  fee,
  isRecommended = false,
  defaultSelect = "",
  onSelect,
}: IProps) {
  const { t } = useTranslation();

  return (
    <div
      data-active={type === defaultSelect}
      className="relative flex h-full w-full cursor-pointer flex-col gap-2.5 rounded-xl border-[3px] border-transparent bg-secondary-500 p-5 transition-all duration-700 ease-in-out hover:bg-background hover:shadow-light-8 data-[active=true]:border-primary data-[active=true]:bg-primary-selected"
    >
      <input
        type="radio"
        checked={type === defaultSelect}
        onChange={() => onSelect(type)}
        className="absolute inset-0 left-0 top-0 cursor-pointer opacity-0"
      />
      <div className="flex items-center gap-2">
        {logo ? (
          <Image
            src={logo}
            alt={name}
            width={100}
            height={100}
            className="size-8"
          />
        ) : null}
        <h5 className="text">{name}</h5>
      </div>
      <div className="flex items-center gap-2.5 py-2.5">
        <p>
          {t("Fee")} {fee}
        </p>
        {isRecommended ? (
          <Badge variant="success">{t("Recommended")}</Badge>
        ) : null}
      </div>
    </div>
  );
}
