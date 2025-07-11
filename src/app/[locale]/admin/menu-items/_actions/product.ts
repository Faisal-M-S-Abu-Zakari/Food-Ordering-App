"use server";

import { Pages, Routes } from "@/constants/enums";
import { getCurrentLocale } from "@/lib/getCurrentLocale";
import { db } from "@/lib/prisma";
import getTrans from "@/lib/translation";
import { revalidatePath } from "next/cache";
import {
  Extra,
  ExtraIngrediants,
  ProductSizes,
  Size,
} from "../../../../../../generated/prisma";
import { addProductSchema, updateProductSchema } from "@/validations/product";

export const addProduct = async (
  args: {
    categoryId: string;
    options: { sizes: Partial<Size>[]; extras: Partial<Extra>[] };
  },
  prevState: unknown,
  formData: FormData
) => {
  const locale = await getCurrentLocale();
  const translations = await getTrans(locale);
  const result = addProductSchema(translations).safeParse(
    // هان بطلع كل يلي داخل الفورم على شكل اوبجيكت
    Object.fromEntries(formData.entries())
  );

  if (result.success === false) {
    return {
      error: result.error.formErrors.fieldErrors,
      status: 400,
      formData,
    };
  }
  // لو التحقق كله كان تمام , هبدأ اجيب الداتا و اتكلم مع الداتا بيز
  const data = result.data;
  // بحوله لرقم لانه كنت عامله سترينج بالسكيما
  const basePrice = Number(data.basePrice);
  // نفس تبعت البروفايل
  const imageFile = data.image as File;
  const imageUrl = Boolean(imageFile.size)
    ? await getImageUrl(imageFile)
    : undefined;
  try {
    // هان الشرط كأنك بتقله مش هتبدأ تنشأ منتج الا لو كان في صورة
    if (imageUrl) {
      await db.product.create({
        data: {
          ...data,
          image: imageUrl,
          basePrice: basePrice,
          // لازم لكل منتج يكون في صنف مرتبط به لذلك عن طريق الارجيمنتس بمرر رقم الصنف
          categoryId: args.categoryId,
          // لازم تبعت الاحجام و الاضافات في الارجيمنتس و هيكونوا عبارة عن مصفوفة
          // use cerateMany because it is array of objects , each obj will have name and price
          sizes: {
            createMany: {
              data: args.options.sizes.map((size) => ({
                name: size.name as ProductSizes,
                price: Number(size.price),
              })),
            },
          },
          // نفس يلي فوقها بالزبط
          extras: {
            createMany: {
              data: args.options.extras.map((extra) => ({
                name: extra.name as ExtraIngrediants,
                price: Number(extra.price),
              })),
            },
          },
        },
      });
      // هان هتعمل ريفاليديت لكل الصفحات يلي هتتأثر لما تضيف عنصر او تعدل عنصر , لحتى يظهروا في كل الصفحات
      // يعني لو ضفت او عدلت عنصر في الادمن فالمفروض يتعدل او ينضاف في المينيو و هكذا
      revalidatePath(`/${locale}/${Routes.MENU}`);
      revalidatePath(`/${locale}/${Routes.ADMIN}/${Pages.MENU_ITEMS}`);
      // برضو هان في الهوم لانه بعرض افضل المنتجات مبيعا لذلك برضو بحتاج التعديل يصير هان
      revalidatePath(`/${locale}`);
      // if everything is okay then return this :
      return {
        status: 201,
        message: translations.messages.productAdded,
      };
    }
    return {};
  } catch (error) {
    console.error(error);
    return {
      status: 500,
      message: translations.messages.unexpectedError,
    };
  }
};

export const updateProduct = async (
  args: {
    productId: string;
    options: { sizes: Partial<Size>[]; extras: Partial<Extra>[] };
  },
  prevState: unknown,
  formData: FormData
) => {
  const locale = await getCurrentLocale();
  const translations = await getTrans(locale);
  const result = updateProductSchema(translations).safeParse(
    Object.fromEntries(formData.entries())
  );
  if (result.success === false) {
    return {
      error: result.error.formErrors.fieldErrors,
      status: 400,
      formData,
    };
  }
  const data = result.data;
  const basePrice = Number(data.basePrice);
  const imageFile = data.image as File;
  const imageUrl = Boolean(imageFile.size)
    ? await getImageUrl(imageFile)
    : undefined;

  // هتجيب العنصر من الداتا بيز
  const product = await db.product.findUnique({
    where: { id: args.productId },
  });

  if (!product) {
    return {
      status: 400,
      message: translations.messages.unexpectedError,
    };
  }
  // بعد ما تأكدت من وجود المنتج يبقى هعمل تحديث
  try {
    const updatedProduct = await db.product.update({
      where: {
        id: args.productId,
      },
      data: {
        ...data,
        basePrice: basePrice,
        image: imageUrl ?? product.image,
      },
    });

    //  لكن لحتى يحذف الاحجام و الاضافات لازم تروح على بريزما و تضيف الامر :
    // onDelete: Cascade ==> in extr and size models
    // اسهل طريقة لتحديث الاحجام و الاضافات هي انه تحذف القيم القديمة و تضيف الجديدة الموجودة لما اليوزر يعمل حفظ
    await db.size.deleteMany({
      where: { productId: args.productId },
    });
    // it is look like the add product , but here i will access to size model by product id
    await db.size.createMany({
      data: args.options.sizes.map((size) => ({
        productId: args.productId,
        name: size.name as ProductSizes,
        price: Number(size.price),
      })),
    });

    // نفس يلي عملته فوق بتكرره هان
    await db.extra.deleteMany({
      where: { productId: args.productId },
    });

    await db.extra.createMany({
      data: args.options.extras.map((extra) => ({
        productId: args.productId,
        name: extra.name as ExtraIngrediants,
        price: Number(extra.price),
      })),
    });
    // طبعا هعمل ريفاليديت للمسارات يلي هتتأثر
    revalidatePath(`/${locale}/${Routes.MENU}`);
    revalidatePath(`/${locale}/${Routes.ADMIN}/${Pages.MENU_ITEMS}`);
    revalidatePath(
      `/${locale}/${Routes.ADMIN}/${Pages.MENU_ITEMS}/${updatedProduct.id}/${Pages.EDIT}`
    );
    revalidatePath(`/${locale}`);
    // بالنهاية هترجع انه التعديلات نجحت
    return {
      status: 200,
      message: translations.messages.updateProductSucess,
    };
  } catch (error) {
    console.error(error);
    return {
      status: 500,
      message: translations.messages.unexpectedError,
    };
  }
};
// نفس الفنكشن تبعت البروفايل مع تعديل في اسم الباث نيم لما تعمل أبيند
const getImageUrl = async (imageFile: File) => {
  const formData = new FormData();
  formData.append("file", imageFile);
  formData.append("pathName", "product_images");

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/upload`,
      {
        method: "POST",
        body: formData,
      }
    );
    console.log(response);
    const image = (await response.json()) as { url: string };
    return image.url;
  } catch (error) {
    console.error("Error uploading file to Cloudinary:", error);
  }
};

// هاد الفنكشن هتاخد منك الاي دي و تبدأ تحذفه من الداتا بيز و تعمل ريفاليديت لباقي الصفحات يلي هيكون ظاهر فيها المنتج
export const deleteProduct = async (id: string) => {
  const locale = await getCurrentLocale();
  const translations = await getTrans(locale);
  try {
    await db.product.delete({
      where: { id },
    });
    revalidatePath(`/${locale}/${Routes.MENU}`);
    revalidatePath(`/${locale}/${Routes.ADMIN}/${Pages.MENU_ITEMS}`);
    revalidatePath(
      `/${locale}/${Routes.ADMIN}/${Pages.MENU_ITEMS}/${id}/${Pages.EDIT}`
    );
    revalidatePath(`/${locale}`);
    return {
      status: 200,
      message: translations.messages.deleteProductSucess,
    };
  } catch (error) {
    console.error(error);
    return {
      status: 500,
      message: translations.messages.unexpectedError,
    };
  }
};
