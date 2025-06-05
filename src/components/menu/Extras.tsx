import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { formateCurrency } from "@/lib/formatters";
interface ISize {
  extras: any;
  item: any;
}
const Extras = ({ extras, item }: ISize) => {
  return extras.map((extra: any) => (
    <div
      key={extra.id}
      className="flex items-center space-x-2 border border-gray-100 rounded-md p-4"
    >
      <Checkbox id={extra.id} />
      <Label
        htmlFor={extra.id}
        className="text-sm text-accent font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
      >
        {extra.name} {formateCurrency(extra.price)}
      </Label>
    </div>
  ));
};

export default Extras;
