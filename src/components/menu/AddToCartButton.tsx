"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Image from "next/image";
import { Label } from "@/components/ui/label";
import PickSize from "./PickSize";
import Extras from "./Extras";
import { productWithRelations } from "@/types/product";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { addCartItem, selectCartItem } from "@/redux/features/cart/cartSlice";
import { useState } from "react";
import { Extra, ProductSizes, Size } from "../../../generated/prisma";
import { formateCurrency } from "@/lib/formatters";
import { getItemQuantity } from "@/lib/Cart";
import ChooseQuantity from "./ChooseQuantity";

interface Item {
  item: productWithRelations;
}

const AddToCartButton = ({ item }: Item) => {
  // 3- daclare the cart , useAppSelector(state=>state.cart.items)

  const cart = useAppSelector(selectCartItem);
  // 2- the default size will be small , to use it .. i have to declare the cart
  const defaultSize =
    // 4-in the cart there is one or more item , so i have to declare in which item i deal or open , so i will map on cart to find the item according to its id then take the size that chossen
    cart.find((el) => el.id === item.id)?.Size ||
    // 5- or select the small as default , if user doesn't select any size
    item.sizes.find((size) => size.name === ProductSizes.SMALL);
  // 1- i need state to save the selected size , then i have to define the default size
  const [selectedSize, setSelecedtSize] = useState<Size>(
    // 6- add ! to tell it that will return sth , not undefined
    defaultSize!
  );
  const defaultExtra = cart.find((el) => el.id === item.id)?.extras || [];
  const [selectedExtras, setSelecedtExtras] = useState<Extra[]>(defaultExtra!);
  // here i want to handle the total price to be affected with extras and sizes
  let totalPrice = item.basePrice;
  // here if the user select size , then change the total
  if (selectedSize) {
    totalPrice += selectedSize.price;
  }
  // if the user add any extra to the extras array , then loop on the array and add the extra price of each selected extras to the total
  if (selectedExtras.length > 0) {
    for (const extra of selectedExtras) {
      totalPrice += extra.price;
    }
  }
  // this function will dispatch action , that will add item to cart
  // 1- i don't have dispatch so i need to declare the dispatch
  const dispatch = useAppDispatch();

  const handleAddToCart = () => {
    dispatch(
      addCartItem({
        // i don't need to send the quantity , because the action will handle it
        basePrice: item.basePrice,
        id: item.id,
        name: item.name,
        image: item.image,
        Size: selectedSize,
        extras: selectedExtras,
      })
    );
  };

  // i need to update the add button to render the quantity of item if i select it
  // so , i need to make function for get the quantity of item
  const itemQuantity = getItemQuantity(item.id, cart);
  return (
    <Dialog>
      <form>
        <DialogTrigger asChild>
          <Button
            type="button"
            size={"lg"}
            className="mt-4 text-white rounded-full !px-8 cursor-pointer"
          >
            <span>Add To Cart</span>
          </Button>
        </DialogTrigger>
        {/* here i determine a height then if the dialog be highter than 80vh , i add overflow to let it be scroll  */}
        <DialogContent className="sm:max-w-[425px] max-h-[80vh] overflow-y-auto">
          {/* here i put the header content in the middle */}
          <DialogHeader className="flex items-center">
            <Image src={item.image} alt={item.name} width={200} height={200} />
            <DialogTitle>{item.name}</DialogTitle>
            <DialogDescription className="text-center">
              {item.description}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-10">
            <div className="space-y-4 text-center ">
              <Label htmlFor="pick-size" className="text-center block">
                Pick your size{" "}
              </Label>
              <PickSize
                sizes={item.sizes}
                item={item}
                selectedSize={selectedSize}
                setSelecedtSize={setSelecedtSize}
              />
            </div>
            <div className="space-y-4 text-center">
              <Label htmlFor="add-extras" className="text-center block">
                Any Extras?
              </Label>
              <Extras
                extras={item.extras}
                selectedExtras={selectedExtras}
                setSelecedtExtras={setSelecedtExtras}
              />
            </div>
          </div>
          <DialogFooter>
            {/* this button when i click on it , it should add item to the cart */}
            {itemQuantity === 0 ? (
              <Button
                onClick={handleAddToCart}
                type="submit"
                className="w-full h-10 cursor-pointer"
              >
                Add to cart {formateCurrency(totalPrice)}
              </Button>
            ) : (
              <ChooseQuantity
                item={item}
                selectedExtras={selectedExtras}
                selectedSize={selectedSize}
                quantity={itemQuantity}
              />
            )}
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
};

export default AddToCartButton;
