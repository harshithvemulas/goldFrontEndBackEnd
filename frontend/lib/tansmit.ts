import { configs } from "@/lib/configs";
import { Transmit } from "@adonisjs/transmit-client";

export const transmit = new Transmit({
  baseUrl: configs.API_URL as string,
});
