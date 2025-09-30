import { configs } from "@/lib/configs";
import { type ClassValue, clsx } from "clsx";
import { toast } from "sonner";
import { twMerge } from "tailwind-merge";

export default function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// start case string
export function startCase(str: string) {
  if (!str) return "";

  return str
    .toLowerCase()
    .split(/[\s_-]+/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

// copy content to clipboard
export const copyContent = (content: string) => {
  if (!content) return;
  navigator.clipboard
    .writeText(content)
    .then(() => toast.success("Copied to clipboard!"))
    .catch(() => {
      toast.error("Failed to copy!");
    });
};

export class Currency {
  currencyCode: string;

  constructor(currencyCode?: string) {
    this.currencyCode = currencyCode || "USD";
  }

  formatter = (amount: number, code?: string) => {
    const currencyCode = code === undefined ? this.currencyCode : code;
    let f;
    try {
      f = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: currencyCode,
        currencySign: "accounting",
        currencyDisplay: "narrowSymbol",
        minimumFractionDigits: 2,
      });
    } catch {
      f = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        currencySign: "accounting",
        currencyDisplay: "narrowSymbol",
        minimumFractionDigits: 2,
      });
    }

    const parts = f.formatToParts(amount);
    const currencySymbol =
      parts.find((part) => part.type === "currency")?.value ?? currencyCode;

    const formattedAmount = f.format(amount);
    const amountText = formattedAmount.substring(currencySymbol.length).trim();

    return {
      currencyCode: currencyCode,
      currencySymbol,
      formattedAmount,
      amountText,
    };
  };

  // format
  format(amount: number, code?: string) {
    const { currencyCode, amountText } = this.formatter(amount, code);
    return `${amountText} ${currencyCode}`;
  }

  // format value code
  formatVC(amount: number, code?: string) {
    const { currencyCode, amountText } = this.formatter(amount, code);
    return `${amountText} ${currencyCode} `;
  }
}

// add prefix for image url
export const imageURL = (url?: string) => {
  if (!url) return "";
  return `${configs.STATIC_URL}/${url}`;
};

export const imageURLPlugin = (url?: string) => {
  if (!url) return "";
  return `${configs.API_URL}/${url}`;
};

// shape phone number
export const shapePhoneNumber = (phone: string) => {
  if (!phone) return "";
  return phone?.match(/^\+/) ? phone : `+${phone}`;
};

// search query
export const searchQuery = (
  value: string,
  variable: string | undefined = "search",
) => {
  const sp = new URLSearchParams(window?.location?.search);
  if (value) sp.set(variable, value);
  else sp.delete(variable);

  return sp;
};

/*
 * Create a number formatter that
 * ensures numbers have at least 2 digits (e.g., 01, 02, 10)
 * Locale set to "en-US"
 * @params digit
 */
export const numberFormat = (
  digit: number | undefined = 2,
  options?: Intl.NumberFormatOptions,
) =>
  new Intl.NumberFormat("en-US", {
    minimumIntegerDigits: digit,
    ...options,
  });

// random value
export const randomNumber = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};
