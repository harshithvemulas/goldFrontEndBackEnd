"use client";

import MpayFooter from "@/app/mpay/_components/mpay-footer";
import MpayHead from "@/app/mpay/_components/mpay-head";
import GlobalLoader from "@/components/common/GlobalLoader";
import { useTransactionDetails } from "@/data/mpay/getTransactionDetails";
import { initPayment } from "@/data/mpay/initPayment";
import { imageURL } from "@/lib/utils";
import { ArrowRight2 } from "iconsax-react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

export default function Mpay() {
  const searchParams = useSearchParams();
  const trxId = searchParams.get("trxId");
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const { data, isLoading } = useTransactionDetails({ trxId: trxId! });
  const { t } = useTranslation();

  const handlePayment = async (method: string) => {
    if (method === "otp_pay") {
      return router.push(`/mpay/otp-pay?trxId=${trxId}`);
    }
    try {
      setLoading(true);
      const res: any = await initPayment(trxId!, method);
      if (!res?.status) {
        toast.error(res?.message);
      }
      if (res?.type === "redirect") {
        window.location.href = res?.redirect;
      }
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error(t("An unknown error occurred"));
      }
    } finally {
      setLoading(false);
    }
    return null;
  };

  if (isLoading || loading) return <GlobalLoader />;
  return (
    <div>
      <MpayHead data={data} />
      <div className="mt-3">
        <div className="py-2">
          <p className="font-semibold">{t("How would you like to pay?")}</p>
        </div>
        <div>
          {data?.gateways.map((gateway: any) => (
            <button
              type="button"
              className="gateway-card my-2 flex h-20 w-full cursor-pointer items-center justify-between rounded-lg border p-4 transition-all duration-300 ease-in-out hover:bg-slate-100"
              key={gateway.value}
              onClick={() => handlePayment(gateway.value)}
            >
              <div className="gateway-info flex items-center gap-4">
                {gateway?.logoImage && (
                  <div className="gateway-logo flex h-12 w-12 items-center justify-center overflow-hidden rounded-full border bg-white bg-contain bg-center bg-no-repeat p-1">
                    <Image
                      src={imageURL(gateway?.logoImage)}
                      alt={gateway?.name}
                      width={80}
                      height={80}
                    />
                  </div>
                )}
                <div className="gateway-name text-left">
                  <h3 className="text-lg font-semibold">{gateway.name}</h3>
                </div>
              </div>
              <div className="gateway-action">
                <ArrowRight2 size={32} className="text-slate-400" />
              </div>
            </button>
          ))}
        </div>
      </div>
      <MpayFooter data={data} />
    </div>
  );
}
