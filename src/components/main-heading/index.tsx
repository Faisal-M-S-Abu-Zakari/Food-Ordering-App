// if you look to the design you will find that before each section there is two line that contain title , and subtitle
// so , i did this component that will be used more than one time
import React from "react";

interface IHeading {
  title: string;
  subTitle: string;
}

const MainHeading = ({ title, subTitle }: IHeading) => {
  return (
    <>
      <span className="uppercase text-accent font-semibold leading-4">
        {subTitle}
      </span>
      <h2 className="text-primary font-bold text-4xl italic">{title}</h2>
    </>
  );
};

export default MainHeading;
