export interface ICard {
  id: number;
  cardId: string;
  userId: number;
  walletId: number;
  number: string;
  cvc: string;
  lastFour: string;
  brand: string;
  expMonth: string;
  expYear: string;
  status: string;
  type: string;
  createdAt: Date;
  updatedAt: Date;
  wallet?: any;
  user?: any;
}

export class Card implements ICard {
  id: number;
  cardId: string;
  userId: number;
  walletId: number;
  number: string;
  cvc: string;
  lastFour: string;
  brand: string;
  expMonth: string;
  expYear: string;
  status: string;
  type: string;
  createdAt: Date;
  updatedAt: Date;
  wallet?: any;
  user?: any;

  constructor(data: any) {
    this.id = data?.id;
    this.cardId = data?.cardId;
    this.userId = data?.userId;
    this.walletId = data?.walletId;
    this.number = data?.number;
    this.cvc = data?.cvc;
    this.lastFour = data?.lastFour;
    this.brand = data?.brand;
    this.expMonth = data?.expMonth;
    this.expYear = data?.expYear;
    this.status = data?.status;
    this.type = data?.type;
    this.createdAt = new Date(data?.createdAt);
    this.updatedAt = new Date(data?.updatedAt);
    this.wallet = data?.wallet;
    this.user = data?.user;
  }
}
