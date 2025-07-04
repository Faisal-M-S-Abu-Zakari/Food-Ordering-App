import { Translations } from "@/types/translations";
import { z } from "zod";

export const updateProfileSchema = (translations: Translations) => {
  return z.object({
    // name and email is required
    name: z
      .string()
      .trim()
      .min(1, { message: translations.validation.nameRequired }),
    email: z.string().trim().email({
      message: translations.validation.validEmail,
    }),
    // in prisma schema i determine these inputs as optional , so here also make them optional
    phone: z
      .string()
      .trim()
      .optional()
      .refine(
        // من اي اداة ذكاء اصطناعي بيعمل الي ريجيكس لرقم الموبايل
        (value) => {
          if (!value) return true;
          return /^\+?[1-9]\d{1,14}$/.test(value);
        },
        // if the number is not valid , the message will appear
        {
          message: translations.profile.form.phone.validation?.invalid,
        }
      ),
    streetAddress: z.string().optional(),
    postalCode: z
      .string()
      .optional()
      .refine(
        (value) => {
          if (!value) return true;
          return /^\d{5,10}$/.test(value);
        },
        {
          message: translations.profile.form.postalCode.validation?.invalid,
        }
      ),
    city: z.string().optional(),
    country: z.string().optional(),
    // the image will send to backend as file (in the frontend i choose file when i need to uplaod photo)
    // but in DB it will be string
    // يعني انا برسله للباك على شكل فايل ولكن بحفظه في الداتا بيز على شكل سترينج
    image: z.custom((val) => val instanceof File).optional(),
  });
};
