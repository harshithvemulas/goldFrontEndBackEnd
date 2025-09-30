"use client";

import { Input } from "@/components/ui/input";
import axios from "@/lib/axios";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

export function WalletIdInput({
  onChange,
  setUser,
  setError,
}: {
  onChange: (value: string) => void;
  setUser: (user: any) => void;
  setError?: (error: string) => void;
}) {
  const [value, setValue] = useState("");
  const [typing, setTyping] = useState(false);

  const { t } = useTranslation();

  let timer: NodeJS.Timeout;

  // fetch user information
  const fetchUserByWallet = async (walletId: string) => {
    try {
      const res = await axios.get(`/wallets/user/${walletId}`);
      if (res && res.status === 200) {
        const user = res?.data;
        onChange(user?.id?.toString());
        setUser({
          id: user?.id,
          avatar: user?.profileImage,
          name: user?.name,
          email: user?.email,
        });
      }
    } catch (error) {
      if (setError !== undefined) {
        setError("Wallet ID is invalid.");
      }
    }
  };

  useEffect(() => {
    if (!timer && typing) {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      timer = setTimeout(() => {
        setTyping(false);
        fetchUserByWallet(value);
      }, 600);
    }
  }, [value]);

  return (
    <Input
      type="text"
      placeholder={t("Enter recipient’s wallet ID")}
      value={value}
      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
        setTyping(true);
        setValue(e.target.value);
        clearTimeout(timer);
      }}
    />
  );
}
