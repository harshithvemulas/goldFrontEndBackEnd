"use client";

import * as React from "react";

import {
  Command,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import cn from "@/lib/utils";
import { ArrowDown2 } from "iconsax-react";
import { useTranslation } from "react-i18next";

interface IProps {
  disabled?: boolean;
  triggerClassName?: string;
  arrowClassName?: string;
}

// export component
export function LangSwitcher({
  disabled = false,
  triggerClassName,
  arrowClassName,
}: IProps) {
  const [open, setOpen] = React.useState(false);

  const [lang, setLang] = React.useState(
    JSON.parse(
      localStorage.getItem("lang") || '{"name": "English", "code": "en"}',
    ),
  );
  const { i18n } = useTranslation();

  React.useEffect(() => {
    i18n.changeLanguage(lang?.code);
  }, [i18n, lang]);

  const appLangs = [
    { code: "en", name: "English" },
    { code: "es", name: "Español" },
    { code: "fr", name: "French" },
    { code: "de", name: "Deutsch" },
    { code: "ru", name: "Russian" },
    { code: "pt", name: "Portuguese" },
    { code: "cn", name: "Chinese" },
    { code: "ar", name: "Arabic" },
  ];

  const switchLang = (lang: string) => {
    const data = appLangs.find((item) => item.name === lang);
    setLang(data);
    localStorage.setItem("lang", JSON.stringify(data));
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        disabled={disabled}
        className={cn(
          "flex h-12 w-full items-center justify-between rounded-2xl border-none border-input bg-accent px-3 text-base",
          triggerClassName,
        )}
      >
        <div className="flex flex-1 items-center">
          <div className="flex flex-1 items-center gap-2 text-left">
            {lang?.name}
          </div>
        </div>

        <ArrowDown2 className={cn("size-6", arrowClassName)} />
      </PopoverTrigger>
      <PopoverContent
        className="min-w-[var(--radix-popover-trigger-width)] p-0"
        align="start"
      >
        <Command>
          <CommandList>
            <CommandGroup>
              {appLangs?.map((l) => (
                <CommandItem
                  key={l.code}
                  value={l.name}
                  onSelect={() => {
                    setOpen(false);
                    switchLang(l.name);
                  }}
                >
                  <span className="pl-1.5">{l.name}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
