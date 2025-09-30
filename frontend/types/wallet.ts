import { Card, ICard } from "@/types/card";
import { ICurrency, Currency } from "@/types/currency";

export interface IWallet {
  id: number;
  walletId: string;
  userId: number;
  balance: string;
  defaultStatus: boolean;
  pinDashboard: boolean;
  currencyId: number;
  createdAt: Date;
  updatedAt: Date;
  currency: ICurrency;
  logo?: string;
  cards?: ICard[];
}

export class Wallet implements IWallet {
  id: number;
  logo?: string;
  walletId: string;
  userId: number;
  balance: string;
  defaultStatus: boolean;
  pinDashboard: boolean;
  currencyId: number;
  createdAt: Date;
  updatedAt: Date;
  currency: Currency;
  cards?: Card[];

  constructor(data: any) {
    this.id = data?.id;
    this.walletId = data?.walletId;
    this.logo = data?.logo;
    this.userId = data?.userId;
    this.balance = data?.balance;
    this.defaultStatus = Boolean(data?.default);
    this.pinDashboard = Boolean(data?.pinDashboard);
    this.currencyId = data?.currencyId;
    this.createdAt = new Date(data?.createdAt);
    this.updatedAt = new Date(data?.updatedAt);
    this.currency = new Currency(data?.currency);
    this.cards = data?.cards?.map((card: any) => new Card(card));
  }
}
