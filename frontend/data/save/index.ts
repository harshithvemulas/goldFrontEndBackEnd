import axios from "@/lib/axios";
import { ErrorResponseGenerator, ResponseGenerator } from "@/data/response";

// save wallet id to saved list
export async function saveWallet(formData: { walletId: string }) {
  try {
    const res = await axios.post("/wallets/save", formData);
    return ResponseGenerator(res);
  } catch (error) {
    return ErrorResponseGenerator(error);
  }
}

// save merchant id
export async function saveMerchant(formData: { merchantId: string }) {
  try {
    const res = await axios.post("/merchants/save", formData);
    return ResponseGenerator(res);
  } catch (error) {
    return ErrorResponseGenerator(error);
  }
}

// save Phone
export async function savePhone(formData: { name: string; number: string }) {
  try {
    const res = await axios.post("/services/phone/save", formData);
    return ResponseGenerator(res);
  } catch (error) {
    return ErrorResponseGenerator(error);
  }
}

// add to contact list
export async function addToContact(formData: { contactId: string | number }) {
  try {
    if (!formData.contactId) throw new Error("contact id not found");
    const res = await axios.post("/contacts/create", formData);
    return ResponseGenerator(res);
  } catch (error) {
    return ErrorResponseGenerator(error);
  }
}
