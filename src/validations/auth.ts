import { Translations } from "@/types/translations";
import * as z from "zod";

// 1- i should declare the login schema
export const loginSchema = (translations: Translations) => {
  return z.object({
    email: z.string().trim().email({
      message: translations.validation.validEmail,
    }),
    password: z
      .string()
      .min(6, { message: translations.validation.passwordMinLength })
      .max(40, { message: translations.validation.passwordMaxLength }),
  });
};
export const signupSchema = (translations: Translations) => {
  return (
    z
      .object({
        name: z
          .string()
          .trim()
          .min(1, { message: translations.validation.nameRequired }),
        email: z.string().trim().email({
          message: translations.validation.validEmail,
        }),
        password: z
          .string()
          .min(6, { message: translations.validation.passwordMinLength })
          .max(40, { message: translations.validation.passwordMaxLength }),
        confirmPassword: z
          .string()
          .min(6, { message: translations.validation.confirmPasswordRequired }),
      })
      // the password and confirmPassword must match so i add the refine that will compare them , then if they are not matching so return message and focus on the confirmPassword path beacuse it will have the error
      .refine((data) => data.password === data.confirmPassword, {
        message: translations.validation.passwordMismatch,
        path: ["confirmPassword"],
      })
  );
};

// this is the type that will back from zod
// if you look  to z.object , you will find that its type is object that has key and value , the key is string and the value will be string but you can have more 1 value so make it array
export type ValidationErrors = { [key: string]: string[] } | undefined;
