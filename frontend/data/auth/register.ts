import { format } from "date-fns";
import axios from "@/lib/axios";
import { configs } from "@/lib/configs";
import type {
  TAgentInfoFormSchema,
  TCustomerRegistrationFormSchema,
  TMerchantInfoFormSchema,
  TPersonalInfoFormSchema,
} from "@/schema/registration-schema";
import { isAxiosError } from "axios";
import { TAgentAgreement } from "@/app/(auth)/register/(tabs)/_components/agent-agreements";

// Customer Registration data
interface IFormData
  extends TCustomerRegistrationFormSchema,
    TPersonalInfoFormSchema {
  accountType: number;
  merchant?: TMerchantInfoFormSchema;
  agent?: TAgentInfoFormSchema & TAgentAgreement;
}

const getSerializedFormData = (fd: IFormData) => {
  const customer = {
    ...fd,
    email: fd.email,
    password: fd.password,
    passwordConfirmation: fd.confirmPassword,
    addressLine: fd.street,
    zipCode: fd.zipCode,
    countryCode: fd.country,
    city: fd.city,
    firstName: fd.firstName,
    lastName: fd.lastName,
    phone: fd.phone,
    gender: fd.title.toLowerCase(),
    dob: format(fd.dateOfBirth, "yyyy-MM-dd"),
    roleId: fd.accountType,
    acceptTermsCondition: fd.termAndCondition,
  };

  if (fd.merchant !== undefined) {
    return {
      ...customer,
      merchant: {
        ...fd.merchant,
        name: fd.merchant.name,
        email: fd.merchant.email,
        proof: fd.merchant.license,
        addressLine: fd.merchant.street,
        zipCode: fd.merchant.zipCode,
        countryCode: fd.merchant.country,
        city: fd.merchant.city,
      },
    };
  }

  if (fd.agent !== undefined) {
    return {
      ...customer,
      agent: {
        ...fd.agent,
        proof: "agent",
        occupation: fd.agent.occupation,
        email: fd.email,
        name: fd.agent.name,
        addressLine: fd.street,
        zipCode: fd.zipCode,
        countryCode: fd.country,
        city: fd.city,
        whatsapp: fd.agent.whatsapp,
        agreeFundingCustomer:
          fd.agent.fundingByAgentAccount?.toLowerCase() === "yes",
        agreeHonest: fd.agent.honestyAgreement?.toLowerCase() === "yes",
        agreeRechargeCustomer:
          fd.agent.rechargeAgreement?.toLowerCase() === "yes",
      },
    };
  }

  return customer;
};

export async function customerRegistration(fd: IFormData): Promise<{
  status: boolean;
  statusCode: number;
  statusText: string;
  message: string;
  data?: { email: string };
}> {
  try {
    const response = await axios.post(
      `${configs.API_URL}/auth/register`,
      getSerializedFormData(fd),
    );

    return {
      statusCode: response.status,
      statusText: response.statusText,
      status: response.status === 201 || response.status === 200,
      message: response.data?.message ?? "",
      data: { email: fd.email },
    };
  } catch (error) {
    let statusCode = 500;
    let statusText = "Internal Server Error";
    let message = "An unknown error occurred";
    if (isAxiosError(error)) {
      statusCode = error.response?.status ?? 500;
      statusText = error.response?.statusText ?? "Internal Server Error";
      message =
        error.response?.data?.message ??
        error.response?.data?.messages?.[0]?.message ??
        error.message;
    }

    return {
      statusCode,
      statusText,
      status: false,
      message,
    };
  }
}

// Merchant account registration
export async function merchantRegistration(fd: IFormData): Promise<{
  status: boolean;
  statusCode: number;
  statusText: string;
  message: string;
  data?: { email: string };
}> {
  try {
    const response = await axios.post(
      `${configs.API_URL}/auth/register`,
      getSerializedFormData(fd),
    );

    return {
      statusCode: response.status,
      statusText: response.statusText,
      status: response.status === 201 || response.status === 200,
      message: response.data?.message ?? "",
      data: { email: fd.email },
    };
  } catch (error) {
    let statusCode = 500;
    let statusText = "Internal Server Error";
    let message = "An unknown error occurred";

    if (isAxiosError(error)) {
      statusCode = error.response?.status ?? 500;
      statusText = error.response?.statusText ?? "Internal Server Error";
      message = error.response?.data?.message ?? error.message;
    } else if (error instanceof Error) {
      message = error.message;
    }

    return {
      statusCode,
      statusText,
      status: false,
      message,
    };
  }
}

// Agent account registration
export async function agentRegistration(fd: IFormData): Promise<{
  status: boolean;
  statusCode: number;
  statusText: string;
  message: string;
  data?: { email: string };
}> {
  try {
    const response = await axios.post(
      `${configs.API_URL}/auth/register`,
      getSerializedFormData(fd),
    );

    return {
      statusCode: response.status,
      statusText: response.statusText,
      status: response.status === 201 || response.status === 200,
      message: response.data?.message ?? "",
      data: { email: fd.email },
    };
  } catch (error) {
    let statusCode = 500;
    let statusText = "Internal Server Error";
    let message = "An unknown error occurred";

    if (isAxiosError(error)) {
      statusCode = error.response?.status ?? 500;
      statusText = error.response?.statusText ?? "Internal Server Error";
      message = error.response?.data?.message ?? error.message;
    } else if (error instanceof Error) {
      message = error.message;
    }

    return {
      statusCode,
      statusText,
      status: false,
      message,
    };
  }
}

// resend validation link
export async function resendEmailValidationCode(email: string): Promise<{
  status: boolean;
  statusCode: number;
  statusText: string;
  message: string;
}> {
  try {
    const response = await axios.post(
      `${configs.API_URL}/auth/resend-verify-email`,
      {
        email,
      },
    );

    return {
      statusCode: response.status,
      statusText: response.statusText,
      status: response.status === 201 || response.status === 200,
      message: response.data?.message ?? "",
    };
  } catch (error) {
    let statusCode = 500;
    let statusText = "Internal Server Error";
    let message = "An unknown error occurred";

    if (isAxiosError(error)) {
      statusCode = error.response?.status ?? 500;
      statusText = error.response?.statusText ?? "Internal Server Error";
      message = error.response?.data?.message ?? error.message;
    } else if (error instanceof Error) {
      message = error.message;
    }

    return {
      statusCode,
      statusText,
      status: false,
      message,
    };
  }
}

// validation user email
export async function verifyAccount({ token }: { token: string }): Promise<{
  status: boolean;
  statusCode: number;
  statusText: string;
  message: string;
}> {
  try {
    const response = await axios.post(`${configs.API_URL}/auth/verify-email`, {
      token,
    });

    return {
      statusCode: response.status,
      statusText: response.statusText,
      status: response.status === 201 || response.status === 200,
      message: response.data?.message ?? "",
    };
  } catch (error) {
    let statusCode = 500;
    let statusText = "Internal Server Error";
    let message = "An unknown error occurred";

    if (isAxiosError(error)) {
      statusCode = error.response?.status ?? 500;
      statusText = error.response?.statusText ?? "Internal Server Error";
      message = error.response?.data?.message ?? error.message;
    } else if (error instanceof Error) {
      message = error.message;
    }

    return {
      statusCode,
      statusText,
      status: false,
      message,
    };
  }
}
