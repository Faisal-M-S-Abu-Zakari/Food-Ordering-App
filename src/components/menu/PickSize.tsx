"use client";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { formateCurrency } from "@/lib/formatters";
import { Size } from "../../../generated/prisma";

import { productWithRelations } from "@/types/product";

interface ISize {
  // this Size and product types from prisma schema , the type should be as the schema name
  sizes: Size[];
  item: productWithRelations;
  selectedSize: Size;
  // if i put the mouse on it in the previous component , it will give you its type
  setSelecedtSize: React.Dispatch<React.SetStateAction<Size>>;
}
function PickSize({ sizes, item, selectedSize, setSelecedtSize }: ISize) {
  return (
    <RadioGroup defaultValue="comfortable">
      {sizes.map((size: any) => (
        <div
          key={size.id}
          className="flex items-center space-x-2 border border-gray-100 rounded-md p-4"
        >
          <RadioGroupItem
            value={selectedSize.name}
            // it will be true , when the selected size match the size that i choose
            checked={selectedSize.id === size.id}
            // here in shadcn ui it consider as button , so the onChange not useful
            onClick={() => setSelecedtSize(size)}
            id={size.id}
          />
          <Label htmlFor={size.id}>
            {size.name} {formateCurrency(size.price + item.basePrice)}
          </Label>
        </div>
      ))}
    </RadioGroup>
  );
}
export default PickSize;
