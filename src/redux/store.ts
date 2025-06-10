import { Environments } from "@/constants/enums";
import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "./features/cart/cartSlice";

// the first step is creating store
export const store = configureStore({
  // when i create slice , will be 2 output from it :
  // 1- actions that will deal with it
  // 2- reducer function that handle the action , untill now we don't have any slice

  // after i create the cart slice , i add it here :
  // i told him that there is cart slice ,that you can use and run its actions
  reducer: {
    cart: cartReducer,
  },
  // to debug redux toolkit , and it work on development enviroment
  devTools: process.env.NODE_ENV === Environments.DEV,
});

// to get the type of this store
export type RootState = ReturnType<typeof store.getState>;
// to get the type of dispatch function that handle action
// here i didn't use "ReturnType" because it use with state not dispatch
export type AppDispatch = typeof store.dispatch;
