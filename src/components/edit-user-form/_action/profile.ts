"use server";
import { Pages, Routes, UserRole } from "@/constants/enums";
import { getCurrentLocale } from "@/lib/getCurrentLocale";
import { db } from "@/lib/prisma";
import getTrans from "@/lib/translation";
import { updateProfileSchema } from "@/validations/profile";
import { revalidatePath } from "next/cache";

export const updateProfile = async (
  isAdmin: boolean,
  prevState: unknown,
  formData: FormData
) => {
  // first i will make schema (validations/profile)
  const locale = await getCurrentLocale();
  const translations = await getTrans(locale);
  const result = updateProfileSchema(translations).safeParse(
    Object.fromEntries(formData.entries())
  );
  if (result.success === false) {
    return {
      error: result.error.formErrors.fieldErrors,
      formData,
    };
  }
  const data = result.data;
  // now i will use the getImageUrl function here , because here i am sure that there is file
  const imageFile = data.image as File;
  // i will send imageUrl to prisma , if it has size > 0 it will return true , so the getImageUrl fn will execute
  const imageUrl = Boolean(imageFile.size)
    ? await getImageUrl(imageFile)
    : undefined;
  //   now call the DB
  try {
    // check if user exist
    const user = await db.user.findUnique({
      where: {
        email: data.email,
      },
    });
    // بالمنطق هل بينفع تعمل تحديث ليوزر غير موجود ! يبقى لازم تعمل شرط لو اليوزر غير موجود
    if (!user) {
      return {
        message: translations.messages.userNotFound,
        status: 401,
        formData,
      };
    }
    // if user exist then update his data , according to this email
    await db.user.update({
      where: {
        email: data.email,
      },
      data: {
        ...data,
        // the image here will be as file , so it will make error ... to fix the error i should determine it as string
        // steps : the image will be in cloud storage , this storage will return url , this url will store in DB
        // so if there is imageUrl i will add it to image input or user.image if there is no image ( default )
        image: imageUrl ?? user.image,

        // هان بحدد الرول و برسله للداتا بيز
        role: isAdmin ? UserRole.ADMIN : UserRole.USER,
      },
    });
    // الان لو كان الاسم فيصل و غيرته لاحمد و عملت حفظ , فإن الاسم يلي هيظهر هو فيصل و لما اعمل ريفريش بيرجع احمد
    // يبقى في جزئية كاش هان لازم اعدلها
    revalidatePath(`/${locale}/${Routes.PROFILE}`);
    // ايضا الادمن بيج هتكون نفس الشي لانها قريبة كثير من الفورم يلي بالبروفايل
    revalidatePath(`/${locale}/${Routes.ADMIN}`);
    // انه ايضا لو اليوزر غير بياناته فإنها تسمع برضو في الراوت هاد
    revalidatePath(`/${locale}/${Routes.ADMIN}/${Pages.USERS}`);
    // هان لما الادمن يعدل لليوزر بياناته
    revalidatePath(
      `/${locale}/${Routes.ADMIN}/${Pages.USERS}/${user.id}/${Pages.EDIT}`
    );
    // يبقى كل الريفاليديت يلي فوق هيكونوا مرتبطين ببعض بحيث وين ما اغير البيانات فإنه راح يسمع في باقي الصفحات و يعمل ريفاليديت للكاش

    // في النهاية بترجع الاوبجيكت
    return {
      status: 200,
      message: translations.messages.updateProfileSucess,
    };
  } catch (error) {
    return {
      status: 500,
      message: translations.messages.unexpectedError,
    };
  }
};

// this function will return the url after it be uploaded in cloud storage
// it will be async ==> because it will deal with api ,and this api will return the image url
// 1- npm i cloudinary
// 2- create cloudinary file in lib folder
// 3- Add the constants to the (.env) file
// 4- generate an api key
const getImageUrl = async (imageFile: File) => {
  // create form that will has file and pathNAme
  const formData = new FormData();
  // the 2 append down i will get them in api
  // here append the inpu with name file with the imageFile
  formData.append("file", imageFile);
  // here i determine the pathName tp be profile_images in cloudinary
  formData.append("pathName", "profile_images");
  // call the api
  try {
    const response = await fetch(
      // add the domain here
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/upload`,
      {
        method: "POST",
        body: formData,
      }
    );
    // this response will return json
    const image = (await response.json()) as { url: string };
    // then return the url
    return image.url;
  } catch (error) {
    console.error("Error uploading file to Cloudinary:", error);
  }
};
