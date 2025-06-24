import { Locale } from "@/i18n.config";
import { headers } from "next/headers";

export const getCurrentLocale = async () => {
  const url = (await headers()).get("x-url");

  // Splits the URL string by / into an array.
  // Takes the fourth element ([3], since arrays are zero-indexed), which is assumed to be the locale part of the URL (e.g., in https://example.com/en/page, "en" would be at index 3).
  //   ["https:", "", "example.com", "en", "products"];
  //   Explanation:
  // "https:" — the protocol
  // "" — because of the double slash after https:
  // "example.com" — the domain
  // "en" — the locale (this is at index 3)
  // "products" — the next part of the path
  // Casts this value to the Locale type.
  const locale = url?.split("/")[3] as Locale;
  return locale;
};
