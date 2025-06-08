import MainHeading from "@/components/main-heading";
import Menu from "@/components/menu";
import { getBestSallers } from "@/server/db/product";
const BestSellers = async () => {
  const bestSellers = await getBestSallers();

  return (
    <section className="section-gap">
      <div className="container">
        <div className="text-center mb-4">
          <MainHeading title="checkout" subTitle="Our Best Sellers" />
        </div>
        <Menu items={bestSellers} />
      </div>
    </section>
  );
};

export default BestSellers;
