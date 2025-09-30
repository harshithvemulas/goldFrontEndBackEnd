import axios from "@/lib/axios";
import { ErrorResponseGenerator, ResponseGenerator } from "@/data/response";
import type { ReturnType } from "@/types/return-type";

interface GatewayFormData {
  [key: string]: string | boolean | File | null;
  uploadLogo?: any;
  active?: any;
  activeApi?: any;
  recommended?: any;
  allowedCurrencies?: any;
}

const STATIC_FIELDS = [
  "uploadLogo",
  "active",
  "activeApi",
  "recommended",
  "allowedCurrencies",
] as const;

function createGatewayFormData(data: GatewayFormData): FormData {
  const fd = new FormData();

  // Handle static fields first
  STATIC_FIELDS.forEach((field) => {
    if (data[field] !== undefined && data[field] !== null) {
      fd.append(
        field,
        data[field] instanceof File ? data[field] : data[field].toString(),
      );
    }
  });

  // Handle remaining dynamic fields
  Object.entries(data).forEach(([key, value]) => {
    if (
      !STATIC_FIELDS.includes(key as (typeof STATIC_FIELDS)[number]) &&
      value !== undefined &&
      value !== null
    ) {
      fd.append(key, value.toString());
    }
  });

  return fd;
}

export async function updateGateway(
  formData: GatewayFormData,
  withdrawId: string | number,
): Promise<ReturnType> {
  try {
    const fd = createGatewayFormData(formData);

    const response = await axios.put(`/admin/gateways/${withdrawId}`, fd, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return ResponseGenerator(response);
  } catch (error) {
    return ErrorResponseGenerator(error);
  }
}
