export type Investment = {
  id: number;
  name: string;
  amountInvested: number;
  currency: string;
  interestRate: number;
  profit: number;
  duration: number;
  durationType: "daily" | "weekly" | "monthly" | "yearly";
  withdrawAfterMatured: number;
  status: "active" | "inactive" | "completed";
  userId: number;
  endsAt: string;
  createdAt: string;
  updatedAt: string;
};
