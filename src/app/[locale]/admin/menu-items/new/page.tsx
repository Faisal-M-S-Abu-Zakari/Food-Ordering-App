// هذه الصفحة هنعرض الي فورم لانشاء منتج جديد

import { Pages, Routes } from "@/constants/enums";
import { getCurrentLocale } from "@/lib/getCurrentLocale";
import getTrans from "@/lib/translation";
import { authOptions } from "@/server/auth";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import Form from "../_components/Form";
import { getCategories } from "@/server/db/categories";
import { UserRole } from "../../../../../../generated/prisma";

async function NewProductPage() {
  const session = await getServerSession(authOptions);
  const locale = await getCurrentLocale();
  const translations = await getTrans(locale);
  // here i will fetch all categories then pass them to the form , so the user can choose from them
  const categories = await getCategories();

  if (!session) {
    redirect(`/${locale}/${Routes.AUTH}/${Pages.LOGIN}`);
  }

  if (session && session.user.role !== UserRole.ADMIN) {
    redirect(`/${locale}/${Routes.PROFILE}`);
  }
  // طبعا لازم تفحص بالبداية هل فيه اصناف موجودة ؟
  // لانه مش منطق اضيف منتج قبل ما اضيف لاي صنف راح ينتمي هذا المنتج
  // يبقى لو ما في اي صنف , لازم احوله لصفحة الاصناف لحتى يضيف الصنف ثم يرجع يضيف المنتج
  if (!categories || categories.length === 0) {
    redirect(`/${locale}/${Routes.ADMIN}/${Pages.CATEGORIES}`);
  }
  return (
    <main>
      <section className="section-gap">
        <div className="container">
          <Form translations={translations} categories={categories} />
        </div>
      </section>
    </main>
  );
}

export default NewProductPage;
