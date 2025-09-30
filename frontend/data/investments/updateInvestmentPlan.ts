import { InvestmentFormData } from "@/app/(protected)/@admin/investments/create-plan/page";
import axios from "@/lib/axios";
import { ErrorResponseGenerator, ResponseGenerator } from "@/data/response";

export async function updateInvestmentPlan({
  formData,
  investmentId,
}: {
  formData: InvestmentFormData;
  investmentId: string;
}) {
  try {
    const updatedFormData = {
      ...formData,
      isActive: formData.isActive ? 1 : 0,
      isFeatured: formData.isFeatured ? 1 : 0,
    };

    const res = await axios.put(
      `/admin/investment-plans/${investmentId}`,
      updatedFormData,
    );
    return ResponseGenerator(res);
  } catch (error) {
    return ErrorResponseGenerator(error);
  }
}
