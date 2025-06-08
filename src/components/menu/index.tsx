import React from "react";
import MenuItem from "./MenuItem";
import { productWithRelations } from "@/types/product";

interface IMenu {
  // at the begining the type was Product , but now after i include the size and extra in it in the previous file ... i have to create custom type to include size , extra and product
  items: productWithRelations[];
}
const Menu = ({ items }: IMenu) => {
  return (
    <ul className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {items.map((item: any) => (
        <MenuItem key={item.id} item={item} />
      ))}
    </ul>
  );
};

export default Menu;
