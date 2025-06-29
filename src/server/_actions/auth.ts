// **************************** this validation must be in server *****************
"use server";

import { Locale } from "@/i18n.config";
import { getCurrentLocale } from "@/lib/getCurrentLocale";
import { db } from "@/lib/prisma";
import getTrans from "@/lib/translation";
import { loginSchema, signupSchema } from "@/validations/auth";
import bcrypt from "bcrypt";
// 1- pass the credentails (from authorize function you can get the credentials type) to make validations , and pass the locale to change the validation messege from arabic to english
export const login = async (
  // you can get the type when you put the mouse on it in the authorize function
  credentials: Record<"email" | "password", string> | undefined,
  locale: Locale
) => {
  // 1- you have to declare the login schema then back to this file to use the schema
  // 2- i should make parsing between credentails with the schema , the schema need the translations so i need to call the translation fn

  const translations = await getTrans(locale);
  const result = loginSchema(translations).safeParse(credentials);
  if (result.success === false) {
    // you can render this object in toast
    return {
      // here i will return the error for each field
      // if you hover on fieldErrors => you will find that it carry the type that i declare in (validations/auth.ts)
      error: result.error.formErrors.fieldErrors,
      status: 400,
    };
  }
  // if there is no error , then use try and catch block to connect with my DB
  // no error means that , the email and password from credentails don't have any error and i will compare them with data in DB to allow the user to make login
  try {
    // here i will access to the user according to the unique email
    const user = await db.user.findUnique({
      where: {
        // here i pass the email after the validation process ==>result.data.email
        email: result.data.email,
      },
    });
    // if user not found
    if (!user) {
      return {
        message: translations.messages.userNotFound,
        // it means unauthorize
        status: 401,
      };
    }
    // now i will compare the plain password from credentails with the hashPassword in DB
    const hashedPassword = user.password;
    // use npm i bcrypt , npm i @types/bcrypt to compare the passwords
    const isValidPassword = await bcrypt.compare(
      result.data.password,
      hashedPassword
    );
    if (!isValidPassword) {
      return {
        message: translations.messages.incorrectPassword,
        status: 401,
      };
    }
    // finally i will return the user to put it in seesion , but i should not return password , so :
    const { password, ...userWithoutPassword } = user;
    return {
      user: userWithoutPassword,
      status: 200,
      message: translations.messages.loginSuccessful,
    };
  } catch (error) {
    console.log(error);
    // it represent internal connection with server so the status 500
    return {
      status: 500,
      message: translations.messages.unexpectedError,
    };
  }
};

// it should take formData as second parameter that has the values from form
// the prevState is not important now
export const signup = async (preState: unknown, formData: FormData) => {
  // this server function will execute inside the useActionState hook , that means that it will execute in client component ,so the "x-url" header will be executed before this function , so i can get the headers here
  // the login function execute in the authorize function in nextAuth , so i get the locale in different way
  const locale = await getCurrentLocale();
  const translations = await getTrans(locale);
  const result = signupSchema(translations).safeParse(
    //Object.fromEntries() ==> Returns an object created by key-value entries for properties and methods
    //(formData.entries() ==>Returns an array of key, value pairs for every entry in the list.
    Object.fromEntries(formData.entries())
  );
  if (result.success === false) {
    // the value you return must match the initial state in signup form
    return {
      error: result.error.formErrors.fieldErrors,
      // هان انا لو دخلت الاسم و البريد و عملت انشاء حساب هيقلي خطأ لانه بيطلب كلمة السر ايضا و بعد ما يقلك خطأ هيفضي كل القيم يلي دخلتها و هترجع تدخلها من ثاني و هاد مش اشي صحيح لذلك بما انه عمل انشاء حساب فالبيانات المدخلة صارت بالسيرفر عندي و بستخدمهم كقيم افتراضية و بالحالة هذه هتلاقي لسا الاسم و الايميل يلي دخلتهم موجودين و فش داعي تكررهم
      formData,

      // here there is no message return in validation error , so don't return the status either

      // status: 400,
    };
  }
  // now start with DB
  try {
    // check if the user exist before create it
    const user = await db.user.findUnique({
      where: {
        email: result.data.email,
      },
    });
    if (user) {
      return {
        status: 409, // it means conflict becuse i try to create account and this account is already exist
        message: translations.messages.userAlreadyExists,
        // رجعتها لنفس السبب يلي كتبته فوق , لحتى ما يمسح البيانات يلي دحلتها و يتعبني من ثاني
        formData,
      };
    }
    // لو المستخدم مش موجود سأقوم بإنشاءه و بالبداية بدي اعمل هاش للباسورد
    const hashedPassword = await bcrypt.hash(result.data.password, 10);
    const createdUser = await db.user.create({
      data: {
        name: result.data.name,
        email: result.data.email,
        password: hashedPassword,
      },
    });
    // finally i return message and status , and i can return some user data to be used
    return {
      status: 201,
      message: translations.messages.accountCreated,
      user: {
        id: createdUser.id,
        name: createdUser.name,
        email: createdUser.email,
      },
    };
  } catch (error) {
    return {
      status: 500,
      message: translations.messages.unexpectedError,
    };
  }
};
