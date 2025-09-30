import axios from "@/lib/axios";
import { ErrorResponseGenerator, ResponseGenerator } from "@/data/response";
import type { ReturnType } from "@/types/return-type";

interface PluginFormData {
  [key: string]: string | boolean | null;
  active: boolean;
}

export async function updatePlugin(
  formData: PluginFormData,
  pluginId: string | number,
): Promise<ReturnType> {
  try {
    const response = await axios.put(
      `/admin/external-plugins/${pluginId}`,
      formData,
    );
    return ResponseGenerator(response);
  } catch (error) {
    return ErrorResponseGenerator(error);
  }
}
