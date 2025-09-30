export class Gateway {
  id: number;
  logoImage: string | null;
  name: string;
  value: string;
  apiKey: string;
  secretKey: string | null;
  active: number;
  activeApi: number;
  recommended: number;
  variables: any | null;
  allowedCurrencies: string[] | null;
  allowedCountries: string[] | null;
  createdAt: Date | null;
  updatedAt: Date | null;

  constructor(data: any) {
    this.id = data?.id;
    this.logoImage = data?.logoImage;
    this.name = data?.name;
    this.value = data?.value;
    this.apiKey = data?.apiKey;
    this.secretKey = data?.secretKey;
    this.active = data?.active;
    this.activeApi = data?.activeApi;
    this.recommended = data?.recommended;
    this.variables = data?.variables;
    this.allowedCurrencies = data?.allowedCurrencies;
    this.allowedCountries = data?.allowedCountries;
    this.createdAt = data?.createdAt ? new Date(data?.createdAt) : null;
    this.updatedAt = data?.updatedAt ? new Date(data?.updatedAt) : null;
  }
}
