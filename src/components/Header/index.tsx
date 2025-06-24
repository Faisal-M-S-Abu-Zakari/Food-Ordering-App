import React from "react";
import Link from "../link";
import { Routes } from "@/constants/enums";
import NavBar from "./NavBar";
import CartButton from "./CartButton";
import { getCurrentLocale } from "@/lib/getCurrentLocale";
import getTrans from "@/lib/translation";
import LanguageSwitcher from "./language-switcher";

const Header = async () => {
  const locale = await getCurrentLocale();
  const { logo, navbar } = await getTrans(locale);

  return (
    <header className="py-4 md:py-6">
      {/* قمت باضافة تعديلات على الكونتينير و ضفته في ملف ال gloabls.css */}
      <div className="container flex items-center justify-between ">
        {/* i did custom link to be used in the whole app */}
        <Link
          // here i did a constant folder that will include all enums
          // here i want it to go to the locale , which is the root so i delete the root
          href={`/${locale}`}
          className="text-primary font-semibold text-2xl"
        >
          🍕 {logo}
        </Link>
        {/* i will fetch the translation here , because header is server component but navBar is client component */}
        <NavBar translations={navbar} />
        <LanguageSwitcher />
        <CartButton />
      </div>
    </header>
  );
};

export default Header;
