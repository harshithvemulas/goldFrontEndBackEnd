import { InvestmentFormData } from "@/app/(protected)/@admin/investments/create-plan/page";
import axios from "@/lib/axios";
import { ErrorResponseGenerator, ResponseGenerator } from "@/data/response";

export async function createInvestmentPlan(formData: InvestmentFormData) {
  try {
    const updatedFormData = {
      ...formData,
      isActive: formData.isActive ? 1 : 0,
      isFeatured: formData.isFeatured ? 1 : 0,
    };

    const res = await axios.post("/admin/investment-plans", updatedFormData);
    return ResponseGenerator(res);
  } catch (error) {
    return ErrorResponseGenerator(error);
  }
}
