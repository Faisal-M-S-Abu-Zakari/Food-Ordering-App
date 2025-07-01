"use client";
import { signOut, useSession } from "next-auth/react";
import { Button } from "../ui/button";
import { Translations } from "@/types/translations";
import { useParams, usePathname, useRouter } from "next/navigation";
import { Pages, Routes } from "@/constants/enums";
import { useClientSession } from "@/hooks/useClientSession";
import { Session } from "next-auth";

const AuthButtons = ({
  initialSession,
  translations,
}: {
  // here the initial session is the session from the server (next-auth)
  initialSession: Session | null;
  translations: Translations;
}) => {
  // here to get the session i use the hook not the getServerSession fn because this is client component
  //   and i must create a provider then  wrap the main layout to get the session

  //   const { data: session } = useSession();
  //   here i use  the custom hook to get the session , this custom hook is better than the useSession hook because it will update the session when the session changes
  //   لما تعمل ريفريش للبيج هتلاقي انه في خطأ في ريندير الكود , لانه بيجيب كان السيشن من السيرفر بعدين من الكلاينت و هاد الشي كان يسبب احطاء في ظهور الازرار بالاسفل
  //   لذلك باستخدام هذه الهوك فانه يجلب السيشن من السيرفر و يلي هتكون معدلة و جاهزة ومش هتعمل اي مشاكل
  const { data: session } = useClientSession(initialSession);
  const pathname = usePathname();
  const router = useRouter();
  const { locale } = useParams();
  return (
    <div>
      {/* it means that user is logged in , so the slog out will appear */}
      {session?.user && (
        <div className="flex items-center gap-10">
          <Button
            className="!px-8 !rounded-full"
            size="lg"
            onClick={() => signOut()}
          >
            {translations.navbar.signOut}
          </Button>
        </div>
      )}
      {/* if user is not logged in , so the login and register will appear */}
      {!session?.user && (
        <div className="flex items-center gap-6">
          <Button
            className={`${
              // here i check if the pathname is the login page , so i will give it the primary color to make it active
              pathname.startsWith(`/${locale}/${Routes.AUTH}/${Pages.LOGIN}`)
                ? "text-primary"
                : "text-accent"
            } hover:text-primary duration-200 transition-colors font-semibold hover:no-underline !px-0`}
            size="lg"
            variant="link"
            onClick={() =>
              router.push(`/${locale}/${Routes.AUTH}/${Pages.LOGIN}`)
            }
          >
            {translations.navbar.login}
          </Button>
          <Button
            className="!px-8 !rounded-full"
            size="lg"
            onClick={() =>
              router.push(`/${locale}/${Routes.AUTH}/${Pages.Register}`)
            }
          >
            {translations.navbar.register}
          </Button>
        </div>
      )}
    </div>
  );
};

export default AuthButtons;
