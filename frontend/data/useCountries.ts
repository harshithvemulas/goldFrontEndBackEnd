"use client";

import { Country } from "@/types/country";
import axios from "axios";
import { toast } from "sonner";
import useSWR from "swr";

const axiosInstance = axios.create({
  baseURL: "https://restcountries.com/v3.1",
  headers: { "Content-Type": "application/json" },
});

const Fields = "name,cca2,ccn3,cca3,status,flag,flags";

export function useCountries() {
  const { data, isLoading, ...args } = useSWR(`/all?fields=${Fields}`, (u) =>
    axiosInstance.get(u),
  );

  const countries = data?.data;

  // get by code
  const getCountryByCode = async (
    code: string,
    cb: (data: Country | null) => void,
  ) => {
    try {
      const res = await axiosInstance.get(
        `/alpha/${code.toLowerCase()}?fields=${Fields}`,
      );
      const country = res.data ? new Country(res.data) : null;
      cb(country);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error("Failed to fetch country");
      }
    }
  };

  return {
    countries: countries ? countries.map((c: any) => new Country(c)) : [],
    isLoading,
    getCountryByCode,
    ...args,
  };
}
