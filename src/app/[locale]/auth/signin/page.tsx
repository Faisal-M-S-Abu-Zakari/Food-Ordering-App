import Link from "@/components/link";
import { buttonVariants } from "@/components/ui/button";
import { Pages, Routes } from "@/constants/enums";
import { getCurrentLocale } from "@/lib/getCurrentLocale";
import React from "react";
import Form from "./_components/Form";
const SigninPage = async () => {
  const locale = await getCurrentLocale();
  return (
    <main>
      {/* i add the element center in gloable css file  */}
      <div className="py-44 md:py-40 bg-gray-50 element-center">
        <div className="container element-center">
          <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold text-center text-black mb-4">
              Welcome Back
            </h2>
            <Form />
            <p className="mt-2 flex items-center justify-center text-accent text-sm">
              <span>Don't have an account?</span>
              <Link
                href={`/${locale}/${Routes.AUTH}/${Pages.Register}`}
                className={`${buttonVariants({
                  variant: "link",
                  size: "sm",
                })} !text-black`}
              >
                Sign Up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
};

export default SigninPage;
