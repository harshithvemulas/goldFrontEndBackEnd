import axios from "@/lib/axios";
import { ErrorResponseGenerator, ResponseGenerator } from "@/data/response";

export async function pinWalletDashboard(params: {
  pinDashboard: boolean;
  walletId: string;
}) {
  try {
    const response = await axios.put(
      `wallets/pin-dashboard/${params.walletId}`,
      params,
    );
    return ResponseGenerator(response);
  } catch (error) {
    return ErrorResponseGenerator(error);
  }
}
