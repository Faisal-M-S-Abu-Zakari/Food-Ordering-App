// 1- this is gurdied route or protected route ==> it means that you have to be logged in to access this page
// 2- How to know that user logged in ? from the cookies you will find session
// 3- so , if i get the seesion here it mean that user can access this page
// 4- if there is a lot of protected route so , i need to repeat the session section and redirect the pages for each page !! but this is not useful , SO :
// in the middleware it check all routes so you can do this part there once insted of doing it for each page
// so in the middleware file , i have to check that there is token ? yes , so i can access to protected pages
import { Pages, Routes } from "@/constants/enums";
import { Locale } from "@/i18n.config";
import { authOptions } from "@/server/auth";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

const ProfilePage = async ({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) => {
  const { locale } = await params;
  // here i get the session , and pass the auth options object to know that user is authorized or not
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect(`/${locale}/${Routes.AUTH}/${Pages.LOGIN}`);
  }
  return <main>test</main>;
};

export default ProfilePage;
