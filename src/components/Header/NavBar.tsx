// first : build the ul , then you will add the button menu , so you need state to contol the apperance of menu button
// then : you will add anothe X button to toggle the menu
"use client";
import React, { useState } from "react";
import Link from "../link";
import { Pages, Routes } from "@/constants/enums";
import { Button, buttonVariants } from "../ui/button";
import { Menu, XIcon } from "lucide-react";
import { useParams, usePathname } from "next/navigation";

const NavBar = ({
  translations,
}: {
  translations: { [key: string]: string };
}) => {
  const [openMenu, setOpenMenu] = useState(false);
  // in client component i use "useParams" to get the locale from url
  // this help me to make the redirect correct when i click on link
  const { locale } = useParams();
  // here i call the pathname to use it to style the active page
  const pathname = usePathname();
  const links = [
    {
      id: crypto.randomUUID(),
      title: translations.menu,
      href: Routes.MENU,
    },
    {
      id: crypto.randomUUID(),
      title: translations.about,
      href: Routes.ABOUT,
    },
    {
      id: crypto.randomUUID(),
      title: translations.contact,
      href: Routes.CONTACT,
    },
    {
      id: crypto.randomUUID(),
      title: translations.login,
      href: `${Routes.AUTH}/${Pages.LOGIN}`,
    },
  ];
  return (
    <nav className="flex-1 justify-end flex">
      {/* it will appear only in small screen */}
      <Button
        variant={"secondary"}
        size="sm"
        className="lg:hidden"
        onClick={() => setOpenMenu(true)}
      >
        <Menu className="!w-6 !h-6" />
      </Button>
      <ul
        className={`fixed lg:static ${
          // هان لو الشرط صحيح راح تظهر الايقونة فوق كل العناصر
          // لو الشرط ما تحقق هطلعها برا الشاشة بناء على السالب يلي اعطيتها اياه
          openMenu ? "left-0 z-50" : "-left-full"
        } top-0 px-10 py-20 lg:p-0 bg-background lg:bg-transparent transition-all duration-200 h-full lg:h-auto flex-col lg:flex-row w-full lg:w-auto flex items-start lg:items-center gap-10`}
      >
        {/* هاد الزر لحتى يقفل المينيو  */}
        <Button
          variant="secondary"
          size="sm"
          className="absolute top-10 right-10 lg:hidden"
          onClick={() => setOpenMenu(false)}
        >
          <XIcon className="!w-6 !h-6" />
        </Button>
        {links.map((link) => (
          <li key={link.id}>
            {/* how to start ? at the first i should do the style for all links , then make the condition to the custome link */}
            {/* here all links has the same style , but the login link it look like button so i will use shadcn library  */}
            {/* so i will add condition , and give it a specific design */}
            <Link
              // لازم تحدد اللوكل لحتى لما تعمل انتقالات بين الصفحات تظل اللغة المستخدمة ثابتة و ما تتغير
              href={`/${locale}/${link.href}`}
              className={`${
                // link.href === `${Routes.AUTH}/${Pages.LOGIN}` it is the same link.href="login" , but i use enums so i should do it like that
                link.href === `${Routes.AUTH}/${Pages.LOGIN}`
                  ? `${buttonVariants({ size: "lg" })} !px-8 !rounded-full`
                  : "text-accent hover:text-primary duration-200 transition-colors "
              } font-semibold ${
                pathname.startsWith(`/${locale}/${link.href}`)
                  ? "text-primary"
                  : "text-accent"
              }
              `}
            >
              {link.title}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default NavBar;
