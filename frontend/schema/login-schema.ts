import { z } from "zod";

export const LoginFormSchema = z.object({
  email: z
    .string({ required_error: "Email address is required." })
    .email({ message: "Invalid email address." }),

  password: z
    .string({ required_error: "Password is required." })
    .min(1, "Password is required."),
});

export type TLoginFormData = z.infer<typeof LoginFormSchema>;
