export class Method {
  id: number;
  logoImage: string | null;
  name: string;
  value: string;
  apiKey: string | null;
  secretKey: string | null;
  params:
    | {
        name: string;
        type: string;
        required: boolean;
      }[]
    | null;
  currencyCode: string;
  countryCode: string;
  active: boolean;
  activeApi: boolean;
  recommended: boolean;
  minAmount: number;
  maxAmount: number;
  fixedCharge: number;
  percentageCharge: number;
  createdAt: Date | null;
  updatedAt: Date | null;

  constructor(data?: any) {
    this.id = data?.id;
    this.logoImage = data?.logoImage;
    this.name = data?.name;
    this.value = data?.value;
    this.apiKey = data?.apiKey;
    this.secretKey = data?.secretKey;
    this.params = data?.params ? JSON.parse(data?.params) : null;
    this.currencyCode = data?.currencyCode;
    this.countryCode = data?.countryCode;
    this.active = Boolean(data?.active);
    this.activeApi = Boolean(data?.activeApi);
    this.recommended = Boolean(data?.recommended);
    this.minAmount = data?.minAmount ?? 0;
    this.maxAmount = data?.maxAmount ?? 0;
    this.fixedCharge = data?.fixedCharge ?? 0;
    this.percentageCharge = data?.percentageCharge;
    this.createdAt = data?.createdAt ? new Date(data.createdAt) : null;
    this.updatedAt = data?.updatedAt ? new Date(data.updatedAt) : null;
  }
}
