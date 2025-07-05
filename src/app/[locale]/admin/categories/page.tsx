// this page will fetch my categories

import { Locale } from "@/i18n.config";
import getTrans from "@/lib/translation";
import { getCategories } from "@/server/db/categories";
import Form from "./_componets/Form";
import CategoryItem from "./_componets/CategoryItem";

const CategoriesPage = async ({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) => {
  const locale = (await params).locale;
  const categories = await getCategories();
  const translations = await getTrans(locale);
  return (
    <main>
      <section className="section-gap">
        <div className="container">
          <div className="sm:max-w-[625px] mx-auto space-y-6">
            <Form translations={translations} />
            {/* render the categories or the para if there is no category */}
            {categories.length > 0 ? (
              <ul className="flex flex-col gap-4">
                {categories.map((category) => (
                  <CategoryItem key={category.id} category={category} />
                ))}
              </ul>
            ) : (
              <p className="text-accent text-center py-10">
                {translations.noCategoriesFound}
              </p>
            )}
          </div>
        </div>
      </section>
    </main>
  );
};

export default CategoriesPage;
