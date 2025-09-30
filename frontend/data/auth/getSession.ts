import axios from "@/lib/axios";

export const getSession = async () => {
  try {
    const response = await axios.get("/auth/check");

    return {
      isLoading: !response?.status,
      data: response.data,
    };
  } catch (error) {
    await fetch("/api/auth/session", { method: "DELETE" });
    return {
      isLoading: false,
      data: null,
      error,
    };
  }
};
