import { RootState } from "@/redux/store";
import { createSlice } from "@reduxjs/toolkit";
import { Extra, Size } from "../../../../generated/prisma";

// here i will declare only the parts of item that will appear in cart
export type CartItem = {
  name: string;
  id: string;
  image: string;
  basePrise: number;
  quantity?: number;
  Size?: Size;
  extras?: Extra[];
};
// then i declare type for all items to use it in initial state
type CartState = {
  items: CartItem[];
};
const initialState: CartState = {
  items: [],
};
export const cartSlice = createSlice({
  // this is the slice name , will appear on devToolKit extension
  //   this name will be used in store file , inside reducer
  name: "cart",
  initialState,
  //   it will contain actions ,E.X:add item to cart
  //   بعدين هيطلع من الاكشن ريديوسير يلي هيعمل هاندل للاكشن
  reducers: {},
});

// here will export the actions in the cart slice
export const {} = cartSlice.actions;

// after the export , you can use this slice in the store
export default cartSlice.reducer;

// when i use useAppSelector , i should pass state=>state.cart.item
// so i will make custom here :
export const selectCartItem = (state: RootState) => state.cart.items;
