// this page must render the top ordered product
import MainHeading from "@/components/main-heading";
import { db } from "@/lib/prisma";
import Menu from "@/components/menu";
const BestSellers = async () => {
  // i can deal with db here , because it is server component
  //  npx prisma studio , this is a new localhost to add data to check your connection
  // const bestSellers = await db.product.findMany();
  // const sizes = await db.size.create({
  //   data: {
  //     name: "SMALL",
  //     price: 0,
  //     productId: "12516353",
  //   },
  // });
  // console.log(sizes);
  const extrs = await db.extra.create({
    data: {
      name: "ONION",
      price: 4,
      productId: "12516353",
    },
  });
  console.log(extrs);

  // const bestSellers = [
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
        {/* <Menu items={bestSellers} /> */}
      </div>
    </section>
  );
};

export default BestSellers;
