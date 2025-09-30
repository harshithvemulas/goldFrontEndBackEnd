import { z } from "zod";

// form schema
export const adminCreateFormSchema = z
  .object({
    firstName: z.string({ required_error: "First name is required" }),
    lastName: z.string({ required_error: "Last name is required" }),
    email: z.string().email("Invalid email address"),
    password: z.string({ required_error: "Password is required" }),
    passwordConfirmation: z.string().optional(),
    addressLine: z.string({ required_error: "Address line is required" }),
    zipCode: z.string({ required_error: "Zip code is required" }),
    city: z.string({ required_error: "City is required" }),
    countryCode: z.string({ required_error: "Country is required" }),
    phone: z.string({ required_error: "Phone is required" }),
    gender: z.enum(["male", "female"]).default("male"),
    dob: z.date(),
  })
  .refine((data) => data.password === data.passwordConfirmation, {
    message: "Passwords don't match",
    path: ["passwordConfirmation"],
  });
