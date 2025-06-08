import MainHeading from "@/components/main-heading";
import { db } from "@/lib/prisma";
import Menu from "@/components/menu";
const BestSellers = async () => {
  const bestSellers = await db.product.findMany({
    include: {
      sizes: true,
      extras: true,
    },
  });

  //   {
  //     id: crypto.randomUUID(),
  //     name: "Pizza",
  //     description: "this is a pizza",
  //     basePrice: 12,
  //     image: "/assets/images/pizza.png",
  //   },
  //   {
  //     id: crypto.randomUUID(),
  //     name: "Pizza",
  //     description: "this is a pizza",
  //     basePrice: 12,
  //     image: "/assets/images/pizza.png",
  //   },
  //   {
  //     id: crypto.randomUUID(),
  //     name: "Pizza",
  //     description: "this is a pizza",
  //     basePrice: 12,
  //     image: "/assets/images/pizza.png",
  //   },
  // ];
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
