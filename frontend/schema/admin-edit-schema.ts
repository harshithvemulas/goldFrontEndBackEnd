import { z } from "zod";

// form schema
export const adminEditFormSchema = z.object({
  firstName: z.string().optional(),
  lastName: z.string({ required_error: "Last name is required" }),
  email: z.string().email("Invalid email address"),
  newPassword: z.string().optional(),
  addressLine: z.string({ required_error: "Address line is required" }),
  zipCode: z.string({ required_error: "Zip code is required" }),
  city: z.string({ required_error: "City is required" }),
  countryCode: z.string({ required_error: "Country is required" }),
  phone: z.string({ required_error: "Phone is required" }),
  gender: z.enum(["male", "female"]).default("male"),
  dob: z.date(),
});
