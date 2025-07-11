import { Pages, Routes } from "@/constants/enums";
import { Locale } from "@/i18n.config";
import { getProduct, getProducts } from "@/server/db/product";
import { redirect } from "next/navigation";
import Form from "../../_components/Form";
import { getCategories } from "@/server/db/categories";
import getTrans from "@/lib/translation";

// هاد الفنكشن لحتى يبدأ ينشأ الصفحات بناء على هذا البارمز
export async function generateStaticParams() {
  const products = await getProducts();
  // productId it must match the same name in dynamic folder
  return products.map((product) => ({ productId: product.id }));
}
async function EditProductPage({
  params,
}: {
  params: Promise<{ locale: Locale; productId: string }>;
}) {
  const { productId, locale } = await params;
  const translations = await getTrans(locale);
  const product = await getProduct(productId);
  // لازم تكون موجودة لانه بينفعش تعدل منتج ملوش صنف
  const categories = await getCategories();

  if (!product) {
    redirect(`/${locale}/${Routes.ADMIN}/${Pages.MENU_ITEMS}`);
  }

  return (
    <main>
      <section>
        <div className="container">
          {/* هاد نفس الفورم تبعت الاضافة */}
          <Form
            categories={categories}
            translations={translations}
            // هان برسل المنتج لحتى اظهر محتوياته بالفورم و اقدر اعدل عليها
            product={product}
          />
        </div>
      </section>
    </main>
  );
}

export default EditProductPage;
