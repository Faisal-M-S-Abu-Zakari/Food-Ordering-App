import React from "react";
import Link from "../link";
import { Routes } from "@/constants/enums";
import NavBar from "./NavBar";
import CartButton from "./CartButton";
import { getCurrentLocale } from "@/lib/getCurrentLocale";
import getTrans from "@/lib/translation";
import LanguageSwitcher from "./language-switcher";
import AuthButtons from "./AuthButtons";
import { getServerSession } from "next-auth";
import { authOptions } from "@/server/auth";

const Header = async () => {
  const locale = await getCurrentLocale();
  const translations = await getTrans(locale);
  const session = await getServerSession(authOptions);

  return (
    <header className="py-4 md:py-6">
      {/* قمت باضافة تعديلات على الكونتينير و ضفته في ملف ال gloabls.css */}
      <div className="container flex items-center justify-between gap-6 lg:gap-10 ">
        {/* i did custom link to be used in the whole app */}
        <Link
          // here i did a constant folder that will include all enums
          // here i want it to go to the locale , which is the root so i delete the root
          href={`/${locale}`}
          className="text-primary font-semibold text-2xl"
        >
          🍕 {translations.logo}
        </Link>
        {/* i will fetch the translation here , because header is server component but navBar is client component */}
        <NavBar translations={translations} initialSession={session} />
        {/* i give it flex-1 to allow this div to take all available space in heafer , then i put it's element in the end */}
        <div className="flex items-center gap-6 flex-1 justify-end">
          {/* in mobile it will be hidden , because it will apear inside menu */}
          <div className="hidden lg:flex lg:items-center lg:gap-6">
            <AuthButtons initialSession={session} translations={translations} />
            <LanguageSwitcher />
          </div>
          <CartButton />
        </div>
      </div>
    </header>
  );
};

export default Header;
