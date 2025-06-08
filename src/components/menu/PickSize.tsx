import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { formateCurrency } from "@/lib/formatters";
import { Product, Size } from "../../../generated/prisma";

interface ISize {
  // this Size and product types from prisma schema , the type should be as the schema name
  sizes: Size[];
  item: Product;
}
function PickSize({ sizes, item }: ISize) {
  return (
    <RadioGroup defaultValue="comfortable">
      {sizes.map((size: any) => (
        <div
          key={size.id}
          className="flex items-center space-x-2 border border-gray-100 rounded-md p-4"
        >
          <RadioGroupItem value="default" id={size.id} />
          <Label htmlFor={size.id}>
            {size.name} {formateCurrency(size.price + item.basePrise)}
          </Label>
        </div>
      ))}
    </RadioGroup>
  );
}
export default PickSize;
