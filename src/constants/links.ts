import { Pages, Routes } from "@/constants/enums";
export const links = [
  { id: crypto.randomUUID(), title: "Menu", href: Routes.MENU },
  { id: crypto.randomUUID(), title: "About", href: Routes.ABOUT },
  { id: crypto.randomUUID(), title: "Contact", href: Routes.CONTACT },
  {
    id: crypto.randomUUID(),
    title: "Login",
    href: `${Routes.AUTH}/${Pages.LOGIN}`,
  },
];
