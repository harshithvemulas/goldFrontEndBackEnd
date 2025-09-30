"use client";

import axios, { AxiosResponse } from "axios";
import i18n from "i18next";
import i18nHttpLoader from "i18next-http-backend";
import { initReactI18next } from "react-i18next";

const getInitialLanguage = () => {
  if (typeof window !== "undefined") {
    const lang = localStorage.getItem("lang");
    return lang ? JSON.parse(lang || "{}")?.code : "en";
  }
  return "en";
};

type Direction = "ltr" | "rtl";

// Add direction detection function
const getDirection = (lng: string): Direction => {
  const rtlLanguages = ["ar"];
  return rtlLanguages.includes(lng) ? "rtl" : "ltr";
};

i18n
  .use(initReactI18next)
  .use(i18nHttpLoader)
  .init({
    interpolation: {
      escapeValue: false,
    },
    lng: getInitialLanguage(),
    fallbackLng: "en",
    react: {
      useSuspense: false,
    },
    saveMissing: false,
    backend: {
      loadPath: `${process.env.NEXT_PUBLIC_API_URL}/langs/{{lng}}.json`,
      addPath: `${process.env.NEXT_PUBLIC_API_URL}/translations/{{lng}}`,
      parse: (data: any) => data,
      parsePayload(_namespace: any, _key: any, fallbackValue: any) {
        return { key: fallbackValue || "" };
      },
      request: (
        _options: any,
        url: string,
        payload: any,
        callback: (arg0: null, arg1: AxiosResponse<any, any> | null) => void,
      ) => {
        if (!payload) {
          axios
            .get(url)
            .then((res) => callback(null, res))
            .catch((err) => callback(err, null));
        } else {
          axios
            .post(url, payload)
            .then((res) => callback(null, res))
            .catch((err) => callback(err, null));
        }
      },
    },
  });

if (typeof window !== "undefined") {
  // Set initial direction
  const initialLng = i18n.language;
  document.documentElement.dir = getDirection(initialLng);

  // Add language change listener
  i18n.on("languageChanged", (lng) => {
    document.documentElement.dir = getDirection(lng);
    document.documentElement.lang = lng;
  });
}

export default i18n;
