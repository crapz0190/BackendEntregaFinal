import { z } from "zod";

export const registerSchema = z.object({
  first_name: z.string({
    required_error: "First name is required",
  }),
  last_name: z.string({
    required_error: "Last name is required",
  }),
  email: z
    .string({
      required_error: "Email is required",
    })
    .email({ message: "Email is not valid" }),
  password: z
    .string({
      required_error: "Password is required",
    })
    .min(8, {
      message: "Password must be at least 8 characters",
    }),
});

export const loginSchema = z.object({
  email: z
    .string({
      required_error: "Email is required",
    })
    .email({
      message: "Email is not valid",
    }),
  password: z
    .string({
      required_error: "Password is required",
    })
    .min(8, {
      message: "Password must be at least 8 characters",
    }),
});

export const emailPwdSchema = z.object({
  email: z
    .string({
      required_error: "Email is required",
    })
    .email({
      message: "Email is not valid",
    }),
});

export const resetPwdSchema = z.object({
  newPassword: z
    .string({
      required_error: "Password is required",
    })
    .min(8, {
      message: "The new password must be at least 8 characters",
    }),

  confirmPassword: z
    .string({
      required_error: "Password is required",
    })
    .min(8, {
      message: "The confirm password must be at least 8 characters",
    }),
});
