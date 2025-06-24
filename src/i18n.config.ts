// كل فكرة هذا الملف انه بحدد فيه اللغات يلي هتعامل معها

import { Languages } from "@/constants/enums";

// هان عملت تايب للغة بشكل عام اما عربي او انجليزي
export type LanguageType = Languages.ARABIC | Languages.ENGLISH;

type i18nType = {
  defaultLocale: LanguageType;
  locales: LanguageType[];
};

// هان انشأت متغير
export const i18n: i18nType = {
  defaultLocale: Languages.ARABIC,
  // here i put the locales that i use in my app
  locales: [Languages.ARABIC, Languages.ENGLISH],
};

// هان لحتى تحدد التايب تبع current localization
export type Locale = (typeof i18n)["locales"][number];
