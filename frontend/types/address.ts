export type TAddress = {
  id: number;
  city: string;
  countryCode: string;
  addressLine: string;
  street: string | null;
  type: string;
  createdAt: Date;
  updatedAt: Date;
  zipCode: string;
};

export class Address {
  id: number;
  city: string;
  countryCode: string;
  addressLine: string;
  street: string | null;
  type: string;
  createdAt: Date;
  updatedAt: Date;
  zipCode: string;

  constructor(address: any) {
    this.id = address?.id;
    this.city = address?.city;
    this.countryCode = address?.countryCode;
    this.addressLine = address?.addressLine;
    this.street = address?.street;
    this.type = address?.type;
    this.zipCode = address?.zipCode;
    this.createdAt = new Date(address?.createdAt);
    this.updatedAt = new Date(address?.updatedAt);
  }
}
