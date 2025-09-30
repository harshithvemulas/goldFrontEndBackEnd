export interface WithdrawAgentMethod extends Record<string, any> {
  active: 0 | 1;
  allowWithdraw: 0 | 1;
  countryCode: string;
  currencyCode: string;
  id: number;
  name: string;
  inputType: "phone" | "email" | "other" | null | undefined;
  requiredInput: 0 | 1;
  otherName: string | null;
  value: string;
}

export interface WithdrawMethod extends Record<string, any> {
  id: number;
  logoImage: string | null;
  name: string;
  value: string;
  params: string;
  currencyCode: string;
  countryCode: string;
  active: 0 | 1;
  activeApi: 0 | 1;
  recommended: 0 | 1;
  minAmount: number;
  maxAmount: number;
  fixedCharge: number;
  percentageCharge: number;
  createdAt: Date | null;
  updatedAt: Date | null;
}
