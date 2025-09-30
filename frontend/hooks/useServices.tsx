import { createTopUp } from "@/data/services/top-up";

export function useServices() {
  // create top up request
  async function createTopUpRequest({
    data,
  }: {
    data: {
      number: string;
      countryCode: string;
      amount: number;
      currencyCode: string;
    };
    redirectURL?: string;
  }) {
    return createTopUp(data);
  }

  return {
    createTopUpRequest,
  };
}
