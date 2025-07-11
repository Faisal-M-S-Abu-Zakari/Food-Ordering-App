import { Translations } from "@/types/translations";
import { z } from "zod";

const imageValidation = (translations: Translations, isRequired: boolean) => {
  return !isRequired
    ? // لو مش مطلوبة هتكون عبارة عن فايل
      // val is the object of file that include name , size , type ...
      z.custom((val) => val instanceof File)
    : z.custom(
        (val) => {
          if (typeof val !== "object" || !val) {
            return false;
          }
          if (!(val instanceof File)) {
            return false;
          }
          // لازم تكون وحدة من هدول الانواع
          // in the image input , you will find that it accept image/*
          // so i determine them here
          // then check the type
          const validMimeTypes = ["image/jpeg", "image/png", "image/gif"];
          return validMimeTypes.includes(val.type);
        },
        // this message will appear if there is no image uploaded
        {
          message:
            translations.admin["menu-items"].form.image.validation.required,
        }
      );
};
// هان بحط الحقول المشتركة بين الاضافة و التعديل و بصير استدعيها في كل وحدة تحت
// بدل ما اكررهم في الاضافة و التعديل
const getCommonValidations = (translations: Translations) => {
  return {
    name: z.string().trim().min(1, {
      message: translations.admin["menu-items"].form.name.validation.required,
    }),
    description: z.string().trim().min(1, {
      message:
        translations.admin["menu-items"].form.description.validation.required,
    }),
    // هان هتكون بالبداية سترينج و لكن بتحولها لرقم في قاعدة البيانات
    // لان الفورم تبعتنا بترجع كل حاجة كسترينج
    basePrice: z.string().min(1, {
      message:
        translations.admin["menu-items"].form.basePrice.validation.required,
    }),
    // و هذه ضرورية جدا لحتى تضيف منتج و تربطه مع صنف
    categoryId: z.string().min(1, {
      message:
        translations.admin["menu-items"].form.category.validation.required,
    }),
  };
};
export const addProductSchema = (translations: Translations) => {
  return z.object({
    ...getCommonValidations(translations),
    // هان في الداتا بيز تبعت المنتج كنت معرفها على انها مطلوبة وليست اختيارية كالتي في اليوزر
    // لذلك لازم اضيفها هان
    // عرفت فنكشن هتاخد منك الترجمة و هل الصورة ضرورية ام لا
    // في تعديل المنتج تحت مش ضروري تضيف صورة لانه موجود الها اساسا
    image: imageValidation(translations, true),
  });
};
export const updateProductSchema = (translations: Translations) => {
  return z.object({
    ...getCommonValidations(translations),
    image: imageValidation(translations, false),
  });
};
