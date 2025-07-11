// هذه الصفحة من خلالها يمكنني اضافة منتج معين
// يبقى هعرض المنتجات الموجودة مع زر لاضافة منتج جديد

import Link from "@/components/link";
import { buttonVariants } from "@/components/ui/button";
import { Languages, Pages, Routes } from "@/constants/enums";
import { Locale } from "@/i18n.config";
import getTrans from "@/lib/translation";
import { authOptions } from "@/server/auth";
import { ArrowRightCircle } from "lucide-react";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import React from "react";
import { UserRole } from "../../../../../generated/prisma";
import { getProducts } from "@/server/db/product";
import MenuItems from "./_components/MenuItems";

const MenuItemsPage = async ({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) => {
  const locale = (await params).locale;
  const translations = await getTrans(locale);
  const session = await getServerSession(authOptions);
  // هان جبت كل المنتجات
  const products = await getProducts();

  if (!session) {
    redirect(`/${locale}/${Routes.AUTH}/${Pages.LOGIN}`);
  }

  if (session && session.user.role !== UserRole.ADMIN) {
    redirect(`/${locale}/${Routes.PROFILE}`);
  }
  return (
    <main>
      <section className="section-gap">
        <div className="container">
          <Link
            href={`/${locale}/${Routes.ADMIN}/${Pages.MENU_ITEMS}/${Pages.NEW}`}
            className={`${buttonVariants({
              variant: "outline",
            })} !mx-auto !flex !w-80 !h-10 mb-8`}
          >
            {translations.admin["menu-items"].createNewMenuItem}
            <ArrowRightCircle
              className={`!w-5 !h-5 ${
                locale === Languages.ARABIC ? "rotate-180 " : ""
              }`}
            />
          </Link>
          <MenuItems products={products} />
        </div>
      </section>
    </main>
  );
};

export default MenuItemsPage;
