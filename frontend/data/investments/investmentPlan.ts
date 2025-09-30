export type InvestmentPlan = {
  id: number;
  name: string;
  description: string | null;
  isActive: boolean;
  isFeatured: boolean;
  isRange: boolean;
  minAmount: number;
  maxAmount: number;
  currency: string;
  interestRate: number;
  duration: number;
  durationType: "daily" | "weekly" | "monthly" | "yearly"; // Adjust based on possible values
  withdrawAfterMatured: boolean;
  createdAt: string; // Can be converted to `Date` if needed
  updatedAt: string;
};
