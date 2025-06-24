import Image from "next/image";
import React from "react";
import pizza from "../../../../public/assets/images/pizza.png";
import Link from "@/components/link";
import { buttonVariants } from "@/components/ui/button";
import { Languages, Routes } from "@/constants/enums";
import { ArrowRightCircle } from "lucide-react";
import { getCurrentLocale } from "@/lib/getCurrentLocale";
import getTrans from "@/lib/translation";
const Hero = async () => {
  const locale = await getCurrentLocale();

  const { home } = await getTrans(locale);
  const { hero } = home;
  return (
    // i make this class = section-gap , it will be in the gloabls.css file =>read it
    <section className="section-gap">
      <div className="container grid grid-cols-1 md:grid-cols-2">
        {/* the height of this div will control the height to the image div , so when i add a lot of text the image will take more height */}
        <div className="md:py-12">
          {/* it is to important to be h1 for SEO */}
          <h1 className="text-4xl font-semibold">{hero.title}</h1>
          <p className="text-accent my-4">{hero.description}</p>
          <div className="flex items-center gap-4">
            <Link
              href={`/${Routes.MENU}`}
              className={`${buttonVariants({
                size: "lg",
              })} space-x-2 !px-4 !rounded-full uppercase`}
            >
              {hero.orderNow}
              <ArrowRightCircle
                className={`!w-5 !h-5 ${
                  // هان عدلت اتجاه السهم بين عربي و انجليزي
                  locale === Languages.ARABIC ? "rotate-180 " : ""
                }`}
              />
            </Link>
            <Link
              href={`/${Routes.ABOUT}`}
              className="flex gap-2 items-center text-black hover:text-primary duration-200 transition-colors font-semibold"
            >
              {hero.learnMore}
              <ArrowRightCircle
                className={`!w-5 !h-5 ${
                  locale === Languages.ARABIC ? "rotate-180 " : ""
                }`}
              />
            </Link>
          </div>
        </div>
        {/* will appear in md and larger screens only , the relative is to force the image to be inside the div*/}
        <div className="relative md:block">
          <Image
            src={pizza}
            alt="pizza logo"
            fill
            loading="eager"
            priority
            // to force the image to resrect it's width and height
            // يعني هتظهر بالطول و العرض تبعها
            // لو قلت الها cover => هتظهر بالطول و العرض يلي انا بخصصه الها
            className="object-contain"
          />
        </div>
      </div>
    </section>
  );
};

export default Hero;
