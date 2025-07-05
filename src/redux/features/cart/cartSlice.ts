import { RootState } from "@/redux/store";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
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

// i want to save my state in localStorage
const initialCartItems =
  typeof window !== "undefined" ? localStorage.getItem("cartItems") : null;
const initialState: CartState = {
  // here i will fetch the items from local storage if founded , and parse them because they are string in localStorage
  items: initialCartItems ? JSON.parse(initialCartItems) : [],
};
export const cartSlice = createSlice({
  // this is the slice name , will appear on devToolKit extension
  //   this name will be used in store file , inside reducer
  name: "cart",
  initialState,
  //   it will contain actions ,E.X:add item to cart
  //   بعدين هيطلع من الاكشن ريديوسير يلي هيعمل هاندل للاكشن
  reducers: {
    // this function has two outputs : current state and action that you will execute
    // the action contain : 1- type , E.X: you add item to cart  , 2- payload , the action will be carry it ( the details of item )
    addCartItem: (state, action: PayloadAction<CartItem>) => {
      // this to find is the item in the payload exist in state or not ?
      const existingItem = state.items.find(
        (item) => item.id === action.payload.id
      );
      if (existingItem) {
        // 1- here if the item is existing then i click on it so increase it's quantity
        // i put || 0 ==> if something happen and ther is no quantity starrt from 0 then add 1
        existingItem.quantity = (existingItem.quantity || 0) + 1;
        // 3-here , if you choose small size then change it to large ... so , i need to tell it to update the state to the new selected size , and the same to extras
        existingItem.Size = action.payload.Size;
        existingItem.extras = action.payload.extras;
      } else {
        //2- here the item doesn't exist so i add the item to the state , and let the quantity start from 1
        state.items.push({ ...action.payload, quantity: 1 });
      }
    },
    // this function for remove the item when click on ( - ) to decrease the quantity
    // i don't need to send the all cart item , so i send the id only
    removeCartItem: (state, action: PayloadAction<{ id: string }>) => {
      // 1- is the item exist in the state ?
      const existingItem = state.items.find(
        (item) => item.id === action.payload.id
      );
      // 2- if it is exist the i will execute one of the logic inside the if block
      // && existingItem.quantity
      if (existingItem) {
        // 3- there is two scenario : 1- the item as added once so it's quantity =1 , then i wii update the state
        if (existingItem.quantity == 1) {
          state.items = state.items.filter(
            (item) => item.id !== action.payload.id
          );
          // 4- if the item is added more than 1 , and you want to decrease it's quantity , so i need to update the quantity
        } else {
          existingItem.quantity! -= 1;
        }
      }
    },
    // this function will execute when i click on 🗑️ , to delete the item from state
    removeItemFromCart: (state, action: PayloadAction<{ id: string }>) => {
      state.items = state.items.filter((item) => item.id !== action.payload.id);
    },
    // to clear the cart from all items
    clearCart: (state) => {
      state.items = [];
    },
  },
});

// here will export the actions in the cart slice
export const { addCartItem, removeCartItem, removeItemFromCart, clearCart } =
  cartSlice.actions;

// after the export , you can use this slice in the store
export default cartSlice.reducer;

// when i use useAppSelector , i should pass state=>state.cart.item
// so i will make custom here :
export const selectCartItem = (state: RootState) => state.cart.items;
