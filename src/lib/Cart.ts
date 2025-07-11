import CartItems from "@/app/[locale]/cart/_components/CartItems";
import { CartItem } from "@/redux/features/cart/cartSlice";

// this function will return single value
// the output will be the number of items orderd and the quantity of each item
// so if i order 2 item , and one of them i order it twice ==> the output will be 3
export const getQuantity = (cart: CartItem[]) => {
  //here i use reduce that take two thing accumlator and current value , then return single value after looping to cart array
  return cart.reduce((acc, cur) => cur.quantity! + acc, 0);
};

// this function will return the quantity of specific item
export const getItemQuantity = (id: string, cart: CartItem[]) => {
  const item = cart.find((el) => el.id === id);
  //   if there is no quantity then return zero
  return item?.quantity || 0;
};

// this function will return the sub total for all items in cart
// so , it should have the base price , size price and extra price for each item
export const getSubTotal = (cart: CartItem[]) => {
  // here , i say that you have to loop on cart and fetch each item and get it's base prise , size and extra price (if founde) because size and extra are optional
  return cart.reduce((total, cartItem) => {
    // reduce the extra array for each item
    const extraTotal = cartItem.extras?.reduce(
      // i will add the extra price to the sum (which is 0 at the begining)
      // (extra.price || 0) ==> it may has no extra so add 0
      (sum, extra) => sum + (extra.price || 0),
      0
    );
    // then i have to add them all togther to get the total price for each item
    const itemTotal =
      (extraTotal || 0) + cartItem.basePrice + (cartItem.Size?.price || 0);
    // then i will return the total price for all items in the cart
    // if i bought the item more than one time ,so i need to add the quantity ( itemTotal * cartItem.quantity! )
    return total + itemTotal * cartItem.quantity!;
  }, 0);
};

export const deliveryFee = 5;

export const getTotalAmount = (cart: CartItem[]) => {
  return getSubTotal(cart) + deliveryFee;
};
