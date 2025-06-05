import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
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

interface Item {
  item: any;
}
const sizes = [
  { id: crypto.randomUUID(), name: "Small", price: 0 },
  { id: crypto.randomUUID(), name: "Medium", price: 4 },
  { id: crypto.randomUUID(), name: "Large", price: 8 },
];
const extras = [
  { id: crypto.randomUUID(), name: "Chesse", price: 2 },
  { id: crypto.randomUUID(), name: "Onion", price: 1 },
  { id: crypto.randomUUID(), name: "Tomato", price: 1.5 },
];
const AddToCartButton = ({ item }: Item) => {
  return (
    <Dialog>
      <form>
        <DialogTrigger asChild>
          <Button
            type="button"
            size={"lg"}
            className="mt-4 text-white rounded-full !px-8"
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
              <PickSize sizes={sizes} item={item} />
            </div>
            <div className="space-y-4 text-center">
              <Label htmlFor="add-extras" className="text-center block">
                Any Extras?
              </Label>
              <Extras extras={extras} item={item} />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" className="w-full h-10">
              Add to cart
            </Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
};

export default AddToCartButton;
