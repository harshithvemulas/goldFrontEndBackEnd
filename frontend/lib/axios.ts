import { configs } from "@/lib/configs";
import axios from "axios";

export default axios.create({
  baseURL: configs.API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});
