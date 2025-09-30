import axios from "@/lib/axios";
import { ErrorResponseGenerator, ResponseGenerator } from "@/data/response";
import type { ReturnType } from "@/types/return-type";

type TFormData = {
  merchant_name: string;
  merchant_email: string;
  merchant_id: string;
  street: string;
  country: string;
  city: string;
  zipCode: string;
  profile?: any;
};

export async function updateMerchantProfile(
  formData: TFormData,
  merchantId: string | number,
): Promise<ReturnType> {
  try {
    const fd = new FormData();
    fd.append("name", formData.merchant_name);
    fd.append("addressLine", formData.street);
    fd.append("countryCode", formData.country);
    fd.append("city", formData.city);
    fd.append("zipCode", formData.zipCode);
    fd.append("email", formData.merchant_email);
    fd.append("storeProfileImage", formData.profile ?? "");

    const response = await axios.put(
      `/admin/merchants/update/${merchantId}`,
      fd,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );

    return ResponseGenerator(response);
  } catch (error) {
    return ErrorResponseGenerator(error);
  }
}
