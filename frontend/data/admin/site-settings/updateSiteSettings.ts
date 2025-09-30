import { TSiteSettingsSchema } from "@/app/(protected)/@admin/settings/site-settings/page";
import axios from "@/lib/axios";
import { ErrorResponseGenerator, ResponseGenerator } from "@/data/response";

export const updateSiteSettings = async (formData: TSiteSettingsSchema) => {
  try {
    const fd = new FormData();

    // Image fields that should only be appended if they're not strings
    const imageFields = ["logo", "favicon", "authBanner", "cardBg"] as const;

    // Append image fields only if they're not strings
    imageFields.forEach((field) => {
      if (typeof formData[field] !== "string" && formData[field]) {
        fd.append(field, formData[field]);
      }
    });

    // Append all other fields
    fd.append("siteName", formData.siteName);
    fd.append("siteUrl", formData.siteUrl);
    fd.append("apiUrl", formData.apiUrl);
    fd.append("defaultCurrency", formData.defaultCurrency);
    fd.append("defaultLanguage", formData.defaultLanguage);
    fd.append("referralBonusAmount", formData.referralBonusAmount);
    fd.append("referralBonusReceiver", formData.referralBonusReceiver);
    fd.append("referralApplyOn", formData.referralApplyOn);
    fd.append("customerRegistration", formData.customerRegistration.toString());
    fd.append("agentRegistration", formData.agentRegistration.toString());
    fd.append("merchantRegistration", formData.merchantRegistration.toString());

    const res = await axios.put("/admin/settings/branding", fd, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return ResponseGenerator(res);
  } catch (error) {
    return ErrorResponseGenerator(error);
  }
};
