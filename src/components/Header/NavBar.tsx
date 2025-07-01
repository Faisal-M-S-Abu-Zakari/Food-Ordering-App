// first : build the ul , then you will add the button menu , so you need state to contol the apperance of menu button
// then : you will add anothe X button to toggle the menu
"use client";
import React, { useState } from "react";
import Link from "../link";
import { Routes } from "@/constants/enums";
import { Button } from "../ui/button";
import { Menu, XIcon } from "lucide-react";
import { useParams, usePathname } from "next/navigation";
import AuthButtons from "./AuthButtons";
import LanguageSwitcher from "./language-switcher";
import { Translations } from "@/types/translations";
import { Session } from "next-auth";
import { useClientSession } from "@/hooks/useClientSession";
import { UserRole } from "../../../generated/prisma";
const NavBar = ({
  initialSession,
  translations,
}: {
  initialSession: Session | null;
  translations: Translations;
}) => {
  const session = useClientSession(initialSession);
  const [openMenu, setOpenMenu] = useState(false);
  // in client component i use "useParams" to get the locale from url
  // this help me to make the redirect correct when i click on link
  const { locale } = useParams();
  // here i call the pathname to use it to style the active page
  const pathname = usePathname();
  const links = [
    {
      id: crypto.randomUUID(),
      title: translations.navbar.menu,
      href: Routes.MENU,
    },
    {
      id: crypto.randomUUID(),
      title: translations.navbar.about,
      href: Routes.ABOUT,
    },
    {
      id: crypto.randomUUID(),
      title: translations.navbar.contact,
      href: Routes.CONTACT,
    },
  ];
  const isAdmin = session.data?.user.role === UserRole.ADMIN;
  return (
    // use oreder to determine the orders that navBar will appear in header , the header must be flex
    // in the mobile it will appear in the last , in lg it will not control it
    <nav className="order-last lg:order-none">
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
              className={`text-accent hover:text-primary duration-200 transition-colors font-semibold ${
                pathname.startsWith(`/${locale}/${link.href}`)
                  ? "text-primary"
                  : "text-accent"
              }
              `}
              // when i click on link it will redirect to it's href , but i give the menu z-50 so the page will not appear until i close the menu so i close it .
              onClick={() => setOpenMenu(false)}
            >
              {link.title}
            </Link>
          </li>
        ))}
        {/* these li will appear only when user logged in */}
        {/* this link will be admin or profile according to the session */}
        {session.data?.user && (
          <li>
            <Link
              href={
                isAdmin
                  ? `/${locale}/${Routes.ADMIN}`
                  : `/${locale}/${Routes.PROFILE}`
              }
              onClick={() => setOpenMenu(false)}
              className={`${
                pathname.startsWith(
                  isAdmin
                    ? `/${locale}/${Routes.ADMIN}`
                    : `/${locale}/${Routes.PROFILE}`
                )
                  ? "text-primary"
                  : "text-accent"
              } hover:text-primary duration-200 transition-colors font-semibold`}
            >
              {isAdmin
                ? translations.navbar.admin
                : translations.navbar.profile}
            </Link>
          </li>
        )}
        {/* here in mobile version i should make these components appear in menu */}
        <li className="lg:hidden flex flex-col gap-4">
          {/* to close the menu when i click on it */}
          <div onClick={() => setOpenMenu(false)}>
            <AuthButtons
              translations={translations}
              initialSession={initialSession}
            />
          </div>
          <LanguageSwitcher />
        </li>
      </ul>
    </nav>
  );
};

export default NavBar;
