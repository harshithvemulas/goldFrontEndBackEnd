import axios from "@/lib/axios";
import { ErrorResponseGenerator, ResponseGenerator } from "@/data/response";

export async function updateMerchant(formData: any) {
  try {
    const fd = new FormData();
    fd.append("name", formData.merchant_name);
    fd.append("addressLine", formData.street);
    fd.append("countryCode", formData.country);
    fd.append("city", formData.city);
    fd.append("zipCode", formData.zipCode);
    fd.append("storeProfileImage", formData.profile);
    fd.append("email", formData.merchant_email);

    const res = await axios.put("/merchants/update", fd, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return ResponseGenerator(res);
  } catch (error) {
    return ErrorResponseGenerator(error);
  }
}
