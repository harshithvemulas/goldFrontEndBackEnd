"use client";

import { PerfectMoneyPayment } from "@/components/payments/PerfectMoneyPayment";
import { useRouter } from "next/navigation";
import { match } from "ts-pattern";

export function DepositConfirmationStage({ res }: { res: any }) {
  const router = useRouter();

  return match(res)
    .with({ type: "redirect" }, () => {
      router.push(res.redirect);
      return null;
    })
    .with({ type: "post", data: { method: "perfectmoney" } }, () => (
      <PerfectMoneyPayment res={res} />
    ))
    .otherwise(() => null);
}
