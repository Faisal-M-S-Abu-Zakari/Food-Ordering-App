import MainHeading from "@/components/main-heading";
import Menu from "@/components/menu";
import { getCurrentLocale } from "@/lib/getCurrentLocale";
import getTrans from "@/lib/translation";
import { getBestSallers } from "@/server/db/product";

const BestSellers = async () => {
  const bestSellers = await getBestSallers(3);
  const locale = await getCurrentLocale();
  const { home } = await getTrans(locale);
  const { bestSeller } = home;
  return (
    <section className="section-gap">
      <div className="container">
        <div className="text-center mb-4">
          <MainHeading
            subTitle={bestSeller.checkOut}
            title={bestSeller.OurBestSellers}
          />
        </div>
        <Menu items={bestSellers} />
      </div>
    </section>
  );
};

export default BestSellers;
