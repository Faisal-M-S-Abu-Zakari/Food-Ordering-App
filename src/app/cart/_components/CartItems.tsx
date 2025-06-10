"use client";

import { selectCartItem } from "@/redux/features/cart/cartSlice";
import { useAppSelector } from "@/redux/hooks";

const CartItems = () => {
  const cart = useAppSelector(selectCartItem);
  return <div>cart items</div>;
};

export default CartItems;
