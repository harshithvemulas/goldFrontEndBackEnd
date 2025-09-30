export class Country {
  name: string;
  flags?: {
    png: string;
    svg: string;
    alt: string;
  };
  code: {
    cca2: string;
    cca3: string;
    ccn3: string;
  };
  status: string;
  flag?: string;

  constructor(country: any) {
    this.name = country?.name?.common;
    this.flags = country?.flags;
    this.flag = country?.flag;
    this.code = {
      cca2: country?.cca2,
      cca3: country?.cca3,
      ccn3: country?.ccn3,
    };
    this.status = country?.status;
  }
}
