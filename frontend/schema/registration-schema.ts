import { z } from "zod";

export const customerRegistrationFormSchema = z
  .object({
    firstName: z.string().min(1, "First name is required."),
    lastName: z.string().min(1, "Last name is required."),
    email: z.string().email({ message: "Invalid email address." }),
    phone: z.string().min(1, "Phone number is required."),
    password: z
      .string({
        required_error: "Password is required",
      })
      .min(8, "Your password must be at least 8 characters long"),
    confirmPassword: z
      .string({
        required_error: "Confirm password is required",
      })
      .min(8, "Password is required."),
    referralCode: z.string().optional(),
    termAndCondition: z.literal(true, {
      errorMap: () => ({ message: "You must accept our terms & conditions" }),
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export interface TCustomerRegistrationFormSchema
  extends z.infer<typeof customerRegistrationFormSchema> {}

export const personalInfoFormSchema = z.object({
  title: z.string().min(1, "Title is required."),
  dateOfBirth: z.date({
    required_error: "A date of birth is required.",
  }),
  // address
  street: z.string().min(1, "Street is required."),
  country: z.string().min(1, "Country is required."),
  city: z.string().min(1, "City is required."),
  zipCode: z.string().min(1, "Zip code is required."),
});

export interface TPersonalInfoFormSchema
  extends z.infer<typeof personalInfoFormSchema> {}

export const merchantInfoFormSchema = z.object({
  name: z
    .string({ required_error: "Full name is required." })
    .min(1, "Full name is required."),

  email: z
    .string({ required_error: "Email address is required." })
    .email({ message: "Invalid email address." }),

  license: z.string().min(1, "Merchant license is required."),
  street: z
    .string({ required_error: "Street is required" })
    .min(1, "Street is required."),
  country: z
    .string({ required_error: "Country is required" })
    .min(1, "Country is required."),
  city: z
    .string({ required_error: "City is required" })
    .min(1, "City is required."),
  zipCode: z
    .string({ required_error: "Zip code is required" })
    .min(1, "Zip code is required."),
});

export interface TMerchantInfoFormSchema
  extends z.infer<typeof merchantInfoFormSchema> {}

export const agentInfoFormSchema = z.object({
  name: z
    .string({ required_error: "Full name is required." })
    .min(1, "Full name is required."),

  occupation: z
    .string({ required_error: "Occupation is required." })
    .min(1, "Occupation is required."),

  whatsapp: z
    .string({ required_error: "WhatsApp link is required." })
    .min(1, "WhatsApp link is required."),
});

export interface TAgentInfoFormSchema
  extends z.infer<typeof agentInfoFormSchema> {}
