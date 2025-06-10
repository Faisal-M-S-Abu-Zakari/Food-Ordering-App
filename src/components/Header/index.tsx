import React from "react";
import Link from "../link";
import { Routes } from "@/constants/enums";
import NavBar from "./NavBar";
import CartButton from "./CartButton";

const Header = () => {
  return (
    <header className="py-4 md:py-6">
      {/* قمت باضافة تعديلات على الكونتينير و ضفته في ملف ال gloabls.css */}
      <div className="container flex items-center justify-between ">
        {/* i did custom link to be used in the whole app */}
        <Link
          // here i did a constant folder that will include all enums
          href={Routes.ROOT}
          className="text-primary font-semibold text-2xl"
        >
          🍕 Pizza
        </Link>
        <NavBar />
        <CartButton />
      </div>
    </header>
  );
};

export default Header;
