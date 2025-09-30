import axios from "@/lib/axios";
import { Address } from "@/types/address";
import { User } from "@/types/user";
import useSWR from "swr";

export function useCustomerSettings() {
  const { data, error, isLoading } = useSWR("/customers/detail", (url) =>
    axios.get(url),
  );

  const user = (data: any) => {
    if (!data) return null;
    return new User({
      ...data,
      ...data?.user,
      avatar: data?.profileImage,
    });
  };

  const address = (data: any) => {
    if (!data) return null;
    return new Address(data?.address);
  };

  return {
    data: data?.data,
    user,
    address,
    isLoading,
    error,
  };
}
