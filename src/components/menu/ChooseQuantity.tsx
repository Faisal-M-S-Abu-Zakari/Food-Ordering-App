"use client";
import React from "react";
import { Button } from "../ui/button";
import { useAppDispatch } from "@/redux/hooks";
import {
  addCartItem,
  removeCartItem,
  removeItemFromCart,
} from "@/redux/features/cart/cartSlice";
import { productWithRelations } from "@/types/product";
import { Extra, Size } from "../../../generated/prisma";
interface Item {
  item: productWithRelations;
  selectedSize: Size;
  selectedExtras: Extra[];
  quantity: number;
}
const ChooseQuantity = ({
  item,
  selectedSize,
  selectedExtras,
  quantity,
}: Item) => {
  const dispatch = useAppDispatch();

  return (
    <div className="flex items-center flex-col gap-2 mt-4 w-full">
      <div className="flex items-center justify-center gap-2">
        <Button
          variant="outline"
          className="cursor-pointer"
          onClick={() => {
            dispatch(removeCartItem({ id: item.id }));
          }}
        >
          -
        </Button>
        <div>
          <span className="text-black"> {quantity} in cart</span>
        </div>
        <Button
          variant="outline"
          className="cursor-pointer"
          onClick={() => {
            dispatch(
              addCartItem({
                name: item.name,
                id: item.id,
                basePrice: item.basePrice,
                image: item.image,
                Size: selectedSize,
                extras: selectedExtras,
              })
            );
          }}
        >
          +
        </Button>
      </div>
      <Button
        size="sm"
        className="cursor-pointer"
        onClick={() => dispatch(removeItemFromCart({ id: item.id }))}
      >
        Remove
      </Button>
    </div>
  );
};

export default ChooseQuantity;
