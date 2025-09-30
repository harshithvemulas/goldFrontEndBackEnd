import axios from "@/lib/axios";
import axiosFetch from "axios";

type TSignInRequestParam = {
  email: string;
  password: string;
};

export async function authSignIn(credentials: TSignInRequestParam): Promise<{
  status: boolean;
  statusCode: number;
  statusText: string;
  message: string;
  token: string | null;
  redirectURL: string | null;
}> {
  try {
    const response = await axios.post("/auth/login", credentials);

    return {
      statusCode: response.status,
      statusText: response.statusText,
      status: response.status === 200,
      message: response.data?.message ?? "",
      token: response.data?.token ?? null,
      redirectURL: response.data?.redirectUrl ?? null,
    };
  } catch (error) {
    let statusCode = 500;
    let statusText = "Internal Server Error";
    let message = "An unknown error occurred";
    const token = null;
    const redirectURL = null;

    if (axiosFetch.isAxiosError(error)) {
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
      token,
      redirectURL,
    };
  }
}

// User Sign in verification
// Two-factor verification
export async function twoFactorVerification({
  token,
  otp,
  isRememberMe,
  fingerprint,
}: {
  token: string;
  otp: string;
  isRememberMe: boolean;
  fingerprint?: string;
}): Promise<{
  status: boolean;
  statusCode: number;
  statusText: string;
  message: string;
}> {
  try {
    const response = await axios.post("/auth/verify-otp", {
      token,
      otp,
      isRememberMe,
      fingerprint,
    });

    return {
      statusCode: response.status,
      statusText: response.statusText,
      status: response.status === 200,
      message: response.data?.message ?? "",
    };
  } catch (error) {
    let statusCode = 500;
    let statusText = "Internal Server Error";
    let message = "An unknown error occurred";

    if (axiosFetch.isAxiosError(error)) {
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

// resend verification code
export async function resendTwoFactorVerificationCode(token: string): Promise<{
  status: boolean;
  statusCode: number;
  statusText: string;
  message: string;
  token: string;
}> {
  try {
    const response = await axios.post("/auth/resend-otp", { token });

    return {
      statusCode: response.status,
      statusText: response.statusText,
      status: response.status === 200,
      message: response.data?.message ?? "",
      token: response.data?.token ?? "",
    };
  } catch (error) {
    let statusCode = 500;
    let statusText = "Internal Server Error";
    let message = "An unknown error occurred";

    if (axiosFetch.isAxiosError(error)) {
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
      token: "",
    };
  }
}

// Forgot password
export async function forgotPassword({ email }: { email: string }) {
  try {
    const response = await axios.post("/auth/forgot-password", { email });

    return {
      statusCode: response.status,
      statusText: response.statusText,
      status: response.status === 200,
      message: response.data?.message ?? "",
    };
  } catch (error) {
    let statusCode = 500;
    let statusText = "Internal Server Error";
    let message = "An unknown error occurred";

    if (axiosFetch.isAxiosError(error)) {
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

// Forgot password
export async function resetPassword({
  password,
  passwordConfirmation,
  token,
}: {
  password: string;
  passwordConfirmation: string;
  token: string;
}) {
  try {
    const response = await axios.post("/auth/reset-password", {
      password,
      passwordConfirmation,
      token,
    });

    return {
      statusCode: response.status,
      statusText: response.statusText,
      status: response.status === 200,
      message: response.data?.message ?? "",
    };
  } catch (error) {
    let statusCode = 500;
    let statusText = "Internal Server Error";
    let message = "An unknown error occurred";

    if (axiosFetch.isAxiosError(error)) {
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
