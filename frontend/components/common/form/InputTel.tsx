"use client";

import { Loader } from "@/components/common/Loader";
import { Flag } from "@/components/icons/Flag";
import {
  Command,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useCountries } from "@/data/useCountries";
import cn from "@/lib/utils";
import { Country } from "@/types/country";
import { ArrowDown2, Global } from "iconsax-react";
import * as libPhoneNumberJS from "libphonenumber-js";
import examples from "libphonenumber-js/mobile/examples";
import { useTranslation } from "react-i18next";

import { useEffect, useState } from "react";

// options
type TOptions = {
  initialCountry?: libPhoneNumberJS.CountryCode;
};

// props types
interface IProps {
  value?: string;
  defaultValue?: string;
  onChange?: (number: string) => void;
  onBlur?: (error: string) => void;
  disabled?: boolean;
  inputClassName?: string;
  options?: TOptions;
}

const validationMessages: {
  [key in libPhoneNumberJS.ValidatePhoneNumberLengthResult]: string;
} = {
  INVALID_COUNTRY: "The selected country is invalid.",
  NOT_A_NUMBER: "The input is not a valid phone number.",
  TOO_SHORT: "The phone number is too short.",
  TOO_LONG: "The phone number is too long.",
  INVALID_LENGTH: "The phone number length is invalid.",
};

export function InputTelNumber({
  value,
  defaultValue = "",
  onChange,
  onBlur,
  disabled,
  inputClassName,
  options,
}: IProps) {
  const [inputValue, setInputValue] = useState(defaultValue ?? "");
  const [callingCode, setCallingCode] = useState<string>("");

  const [country, setCountry] = useState<
    libPhoneNumberJS.CountryCode | undefined
  >(options?.initialCountry);

  const setPhoneNumber = (phoneNumber: string) => {
    if (phoneNumber) {
      try {
        const phone = libPhoneNumberJS.parsePhoneNumberFromString(
          phoneNumber,
          country,
        );
        if (phone) {
          setCountry(phone.country);
          setCallingCode(`+${phone.countryCallingCode}`);
          setInputValue(phone.formatNational());
        } else {
          setInputValue(phoneNumber);
        }
      } catch (error) {
        // If parsing fails, just set the raw input value
        setInputValue(phoneNumber);
      }
    } else {
      setInputValue(phoneNumber);
    }
  };

  useEffect(() => {
    if (value) {
      setPhoneNumber(value as string);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  const placeholder = libPhoneNumberJS.getExampleNumber(
    country || options?.initialCountry || "US",
    examples,
  );

  // handle country change
  const handleCountryChange = (country: Country) => {
    const countryCode =
      country.code.cca2?.toUpperCase() as libPhoneNumberJS.CountryCode;

    const countryCallingCode =
      libPhoneNumberJS.getCountryCallingCode(countryCode);

    setCallingCode(`+${countryCallingCode}`);
    setCountry(countryCode);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;

    const phone = libPhoneNumberJS.parsePhoneNumberFromString(value, country);
    onBlur?.("");
    if (
      phone &&
      libPhoneNumberJS.isPossiblePhoneNumber(value, country) &&
      libPhoneNumberJS.isValidNumber(value, country)
    ) {
      setCountry(phone.country);
      setCallingCode(`+${phone.countryCallingCode}`);
      onChange?.(phone.number);
      setInputValue(value);
    } else {
      if (phone) {
        setInputValue(phone.nationalNumber);
      } else {
        setInputValue(value);
      }
      onChange?.(value);
    }
  };

  // handle paste data
  const handleOnPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const pastedText = e.clipboardData.getData("Text");

    const phone = libPhoneNumberJS.parsePhoneNumberFromString(pastedText);

    if (phone && libPhoneNumberJS.isPossiblePhoneNumber(pastedText)) {
      const formattedPhone = phone.formatNational();
      setPhoneNumber(formattedPhone);
      setCountry(phone.country);
      setCallingCode(`+${phone.countryCallingCode}`);
      onChange?.(phone.number);
      onBlur?.("");
    } else {
      const fallbackPhone = libPhoneNumberJS.parsePhoneNumberFromString(
        pastedText,
        country,
      );

      if (
        fallbackPhone &&
        libPhoneNumberJS.isPossiblePhoneNumber(pastedText, country)
      ) {
        const formattedPhone = fallbackPhone.formatNational();
        setPhoneNumber(formattedPhone);
        onChange?.(fallbackPhone.number);
        onBlur?.("");
      }
    }
  };

  // handle blur
  const handleOnBlur = () => {
    if (
      inputValue &&
      !libPhoneNumberJS.isValidPhoneNumber(inputValue, country)
    ) {
      const validationError = libPhoneNumberJS.validatePhoneNumberLength(
        inputValue,
        country,
      );

      if (validationError) {
        onBlur?.(validationMessages[validationError]);
      }
    }
  };

  return (
    <div className="flex items-center rounded-lg bg-input">
      <div className="flex items-center">
        <CountrySelection
          country={country}
          disabled={disabled}
          initialCountry={options?.initialCountry}
          onSelect={handleCountryChange}
        />

        <span className="text-semibold inline-block pr-1.5 text-base empty:hidden">
          {callingCode || `+${placeholder?.countryCallingCode}`}
        </span>
      </div>
      <Input
        type="tel"
        className={cn("rounded-l-none pl-2", inputClassName)}
        value={inputValue}
        onChange={handleInputChange}
        onPaste={handleOnPaste}
        onBlur={handleOnBlur}
        placeholder={placeholder?.formatNational()}
        disabled={disabled}
      />
    </div>
  );
}

function CountrySelection({
  initialCountry,
  country,
  onSelect,
  disabled,
}: {
  country?: libPhoneNumberJS.CountryCode;
  initialCountry?: libPhoneNumberJS.CountryCode;
  onSelect: (country: Country) => void;
  disabled?: boolean;
}) {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        disabled={disabled}
        className="flex h-12 w-[64px] items-center gap-1 border border-transparent pl-3 pr-1.5 hover:bg-muted"
      >
        {initialCountry || country ? (
          <Flag
            countryCode={country || initialCountry}
            className="aspect-auto h-[18px] w-7 flex-1"
          />
        ) : (
          <Global />
        )}
        <ArrowDown2 variant="Bold" size={16} />
      </PopoverTrigger>

      <PopoverContent align="start" className="h-fit p-0">
        <CountryListRender
          defaultValue={country || initialCountry}
          onSelect={(c) => {
            onSelect(c);
            setOpen(false);
          }}
        />
      </PopoverContent>
    </Popover>
  );
}

function CountryListRender({
  defaultValue,
  onSelect,
}: {
  defaultValue?: string;
  onSelect: (country: Country) => void;
}) {
  const { countries, isLoading } = useCountries();
  const { t } = useTranslation();

  const getAvailableCountry = (countries: Country[]) =>
    countries.filter((c) => {
      const cca2 = c.code.cca2?.toUpperCase() as libPhoneNumberJS.CountryCode;
      return libPhoneNumberJS.getCountries().includes(cca2);
    });

  return (
    <Command>
      <CommandInput
        placeholder={t("Search country by name")}
        className="placeholder:text-input-placeholder"
      />
      <CommandList>
        <CommandGroup>
          {!isLoading ? (
            getAvailableCountry(countries)?.map((country: Country) => (
              <CommandItem
                key={country.code.ccn3}
                value={country.name}
                data-active={country.code.cca2 === defaultValue}
                className="flex items-center gap-1.5 data-[active=true]:bg-input"
                onSelect={() => onSelect(country)}
              >
                <Flag countryCode={country.code.cca2} />
                {country.name}
              </CommandItem>
            ))
          ) : (
            <CommandItem>
              <Loader />
            </CommandItem>
          )}
        </CommandGroup>
      </CommandList>
    </Command>
  );
}
