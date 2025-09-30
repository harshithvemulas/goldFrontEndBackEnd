import axios from "@/lib/axios";
import { ErrorResponseGenerator, ResponseGenerator } from "@/data/response";
import type { ReturnType } from "@/types/return-type";
import { TWithdrawMethodData } from "@/schema/withdraw-method-schema";

export async function createWithdrawMethod(
  formData: TWithdrawMethodData,
): Promise<ReturnType> {
  try {
    const fd = new FormData();
    fd.append("name", formData.name);
    fd.append("countryCode", formData.countryCode);
    fd.append("currencyCode", formData.currencyCode);
    fd.append("active", formData.active.toString());
    fd.append("recommended", formData.recommended.toString());
    fd.append("minAmount", formData.minAmount?.toString() ?? "");
    fd.append("maxAmount", formData.maxAmount?.toString() ?? "");
    fd.append("fixedCharge", formData.fixedCharge?.toString() ?? "");
    fd.append("percentageCharge", formData.percentageCharge?.toString() ?? "");
    fd.append("inputParams", JSON.stringify(formData.params));
    if (formData.uploadLogo) {
      fd.append("uploadLogo", formData.uploadLogo);
    }

    const response = await axios.post(`/admin/methods`, fd, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return ResponseGenerator(response);
  } catch (error) {
    return ErrorResponseGenerator(error);
  }
}
