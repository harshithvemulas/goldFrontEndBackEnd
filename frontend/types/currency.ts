export interface ICurrency {
  id: number;
  name: string;
  code: string;
  usdRate: number;
  acceptApiRate: boolean;
  isCrypto: boolean;
  active: boolean;
  metaData: any | null; // `any` can be replaced with a more specific type if known
  minAmount: number;
  maxAmount: number;
  kycLimit: number;
  createdAt: Date;
  updatedAt: Date;

  // Method to return the currency symbol
  getCurrencySymbol: () => string;

  // Method to format the amount with the currency symbol
  format: (amount: number) => string;

  // Method to get the formatted amount without the currency symbol
  getFormattedAmountWithoutSymbol: (amount: number) => string;

  // Internal method for formatting (not necessarily exposed, but could be useful)
  formatter: (amount: number) => {
    currencyCode: string;
    currencySymbol: string;
    formattedAmount: string;
    amountText: string;
  };
}

export class Currency implements ICurrency {
  createdAt: Date;
  updatedAt: Date;
  maxAmount: number;
  kycLimit: number;
  dailyTransferAmount: number;
  dailyTransferLimit: number;
  metaData: string | null;
  minAmount: number;
  id: number;
  name: string;
  code: string;
  logo: string;
  usdRate: number;
  acceptApiRate: boolean;
  isCrypto: boolean;
  active: boolean;

  constructor(data: any) {
    this.id = data?.id;
    this.name = data?.name;
    this.code = data?.code;
    this.logo = data?.logo ?? "";
    this.usdRate = data?.usdRate; // Convert string usdRate to a float
    this.acceptApiRate = Boolean(data?.acceptApiRate);
    this.isCrypto = Boolean(data?.isCrypto);
    this.active = Boolean(data?.active);
    this.metaData = data?.metaData;
    this.minAmount = data?.minAmount; // Convert string minAmount to a float
    this.kycLimit = data?.kycLimit; // Convert string minAmount to a float
    this.maxAmount = data?.maxAmount; // Convert string maxAmount to a float
    this.dailyTransferAmount = data?.dailyTransferAmount; // Convert string maxAmount to a float
    this.dailyTransferLimit = data?.dailyTransferLimit; // Convert string maxAmount to a float
    this.createdAt = new Date(data?.createdAt);
    this.updatedAt = new Date(data?.updatedAt);
  }

  formatter = (amount: number) => {
    const f = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: this.code,
      currencySign: "accounting",
      currencyDisplay: "code",
      minimumFractionDigits: 2,
    });

    const parts = f.formatToParts(amount);
    const currencySymbol =
      parts.find((part) => part.type === "currency")?.value ?? this.code;

    const formattedAmount = f.format(amount);
    const amountText = formattedAmount.substring(currencySymbol.length).trim();

    return {
      currencyCode: this.code,
      currencySymbol,
      formattedAmount,
      amountText,
    };
  };

  // format
  format(amount: number) {
    const { currencySymbol, amountText } = this.formatter(amount);
    return `${amountText} ${currencySymbol}`;
  }

  getCurrencySymbol() {
    const { currencySymbol } = this.formatter(0);
    return currencySymbol;
  }

  getFormattedAmountWithoutSymbol(amount: number) {
    const { amountText } = this.formatter(amount);
    return amountText;
  }
}
