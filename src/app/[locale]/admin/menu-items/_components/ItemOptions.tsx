/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Translations } from "@/types/translations";
import { Plus, Trash2 } from "lucide-react";

import { useParams } from "next/navigation";
import { Languages } from "@/constants/enums";
import {
  Extra,
  ExtraIngrediants,
  ProductSizes,
  Size,
} from "../../../../../../generated/prisma";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export enum ItemOptionsKeys {
  SIZES,
  EXTRAS,
}

// get them from prisma enums
const sizesNames = [
  ProductSizes.SMALL,
  ProductSizes.MEDUIM,
  ProductSizes.LARGE,
];

const extrasNames = [
  ExtraIngrediants.CHEESE,
  ExtraIngrediants.BACON,
  ExtraIngrediants.ONION,
  ExtraIngrediants.PEPPER,
  ExtraIngrediants.TOMATO,
];

// this function will return 3 methods
function handleOptions(
  setState:
    | React.Dispatch<React.SetStateAction<Partial<Size>[]>>
    | React.Dispatch<React.SetStateAction<Partial<Extra>[]>>
) {
  // the state will look like : [{name:samll , price : 0} , {name:meduim , price : 5} ....]
  // the logic here is simple , i only add the new option to array and keep the previous options also
  const addOption = () => {
    setState((prev: any) => {
      return [...prev, { name: "", price: 0 }];
    });
  };
  // this function i will use it to change size name and size price
  // so i will pass fieldName to determine that this method for name or price
  const onChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number,
    // i add this parameter to use the same function twice , in the first time to change size name , in the second to change the price
    // so this parameter will determine to which case i will use the method
    fieldName: string
  ) => {
    // القيمة الجديدة يلي اخترتها
    const newValue = e.target.value;
    setState((prev: any) => {
      // using spreed operator to get the previous array with old values
      // the array is group of objects that will include the name and price
      const newSizes = [...prev];
      // the state will look like : [{name:samll , price : 0} , {name:meduim , price : 5} ....]
      // so the index will represent wich object in array , and after i choose object i will change his name or price according to the fieldName
      // so to access the price , you have to access the object first then use second key to access the price inside object
      // now i should change the existing value with the new value
      // so if i want to change the price of Small size
      // the index will be 0 and field name will be "price" so here i access to the price then i give it the new value
      // if the fieldName is "name" so i will change the size name here not price
      newSizes[index][fieldName] = newValue;
      return newSizes;
    });
  };
  // it is so simple
  // and i delete the items according to there index in the array
  const removeOption = (indexToRemove: number) => {
    setState((prev: any) => {
      return prev.filter((_: any, index: number) => index !== indexToRemove);
    });
  };
  // then return the all functions
  return { addOption, onChange, removeOption };
}

// option key will determine that this component will contain sizes or extras
function ItemOptions({
  state,
  setState,
  translations,
  optionKey,
}: {
  state: Partial<Size>[] | Partial<Extra>[];
  setState:
    | React.Dispatch<React.SetStateAction<Partial<Size>[]>>
    | React.Dispatch<React.SetStateAction<Partial<Extra>[]>>;
  translations: Translations;
  optionKey: ItemOptionsKeys;
}) {
  const { addOption, onChange, removeOption } = handleOptions(setState);

  // هذه الفنكشن لحتى يوقف عن الاضافة عند رقم معين
  // يعني في الاحجام هيظل يسمح الك لتضيف حجم لحتى تتساوي طول المصفوفتين
  // مصفوفة الاحجام فيها 3 عناصر يبقى هيخليني اضييف للمصفوفة الحالية احجام لبال ما يصير فيها 3 عناصر
  const isThereAvailableOptions = () => {
    switch (optionKey) {
      case ItemOptionsKeys.SIZES:
        return sizesNames.length > state.length;
      case ItemOptionsKeys.EXTRAS:
        return extrasNames.length > state.length;
    }
  };
  return (
    <>
      {/* بعد ما ضفت الزر هتصير تعمل لوب على الستايت بحيث تظهرهم هان في حال وجود ستايت */}
      {state.length > 0 && (
        <ul>
          {state.map((item, index) => {
            return (
              // it will render li that include 3 divs :
              // 1- div for select name
              // 2- div for select price
              // 3- div for remove the item
              <li key={index} className="flex gap-2 mb-2">
                <div className="space-y-1 basis-1/2">
                  <Label>name</Label>
                  {/* make seprate component to keep your jsx clean */}
                  <SelectName
                    item={item}
                    onChange={onChange}
                    index={index}
                    currentState={state}
                    optionKey={optionKey}
                  />
                </div>
                <div className="space-y-1 basis-1/2">
                  <Label>Extra Price</Label>
                  <Input
                    type="number"
                    placeholder="0"
                    min={0}
                    // it must match the name inside the state
                    name="price"
                    value={item.price}
                    onChange={(e) => onChange(e, index, "price")}
                    className="bg-white focus:!ring-0"
                  />
                </div>
                <div className="flex items-end">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => removeOption(index)}
                  >
                    <Trash2 />
                  </Button>
                </div>
              </li>
            );
          })}
        </ul>
      )}
      {/* اول خطوة في هذا الكومبونينت هي اضافة الزر  */}
      {/* الفكرة هان انه تخيل عندك مصفوفة الاحجام مثلا و فيها 3 عناصر , يبقى كل ضغظة على الزر هتعمل لوب على المصفوفة و تنشأ عنصر من المصفوفة هذه  */}
      {/* it mean that each click will loop on array and render new li */}
      {/* this part will be state management */}
      {isThereAvailableOptions() && (
        <Button
          // here i should determine that this is button type not submit
          type="button"
          variant="outline"
          className="w-full"
          onClick={addOption}
        >
          <Plus />
          {optionKey === ItemOptionsKeys.SIZES
            ? translations.admin["menu-items"].addItemSize
            : translations.admin["menu-items"].addExtraItem}
        </Button>
      )}
    </>
  );
}

export default ItemOptions;

// هان هتبعت اله الاحجام او الاضافات المتوفرة عندي و هو هيعمل لوب عليهم ويظهرهم
const SelectName = ({
  onChange,
  index,
  item,
  currentState,
  optionKey,
}: {
  index: number;
  item: Partial<Size> | Partial<Extra>;
  currentState: Partial<Size>[] | Partial<Extra>[];
  optionKey: ItemOptionsKeys;
  onChange: (e: any, index: any, fieldName: any) => void;
}) => {
  const { locale } = useParams();

  // هذه الفنكشن كل وظيفتها انها تحذف الخيار يلي اخترته
  // يعني لو اخترت سمول لعنصر ما و رجعت تضيف كمان حجم فخيار السمول مش هيكون متاح
  // i have sizesNames array [SMALL , MEDUIM , LARGE]
  // i will loop on it , and compare it with the current state array
  // if i choose small , so it will be added to currentState
  // then the sizesName and currentState will have small option
  // so delete small option from current state
  // نفس الشيء بالنسبة للاضافات
  // يبقى هان انا بعمل فلتر للمصفوفة الاساسية بناء على المصفوفة الداهلية (الحالية )
  const getNames = () => {
    switch (optionKey) {
      case ItemOptionsKeys.SIZES:
        const filteredSizes = sizesNames.filter(
          // some return boolean , so if it return true then i use ! to remove it
          // it will return true when same option be in the two arrays
          (size) => !currentState.some((s) => s.name === size)
        );
        return filteredSizes;
      case ItemOptionsKeys.EXTRAS:
        const filteredExtras = extrasNames.filter(
          (extra) => !currentState.some((e) => e.name === extra)
        );
        return filteredExtras;
    }
  };

  const names = getNames();

  return (
    <Select
      // to change the value i should add onValueChange
      // the value here is coming from value inside selectItem
      // here it suppose to change the state , so i make function onChange
      onValueChange={(value) => {
        // { target: { value } } this is represent event (e)
        // ما بيزبط تمرر القيمة بدون كلمة تارجيت
        // لانه فوق بالميثود انا باخد القيمة من التارجيت , يبقى لازم يكون الشغل متطابق
        onChange({ target: { value } }, index, "name");
      }}
      // the default value must match the selectValue inside selectTrigger
      defaultValue={item.name ? item.name : "select..."}
    >
      <SelectTrigger
        className={` bg-white border-none mb-4 focus:ring-0 ${
          locale === Languages.ARABIC ? "flex-row-reverse" : "flex-row"
        }`}
      >
        <SelectValue>{item.name ? item.name : "select..."}</SelectValue>
      </SelectTrigger>
      <SelectContent className="bg-transparent border-none z-50 bg-white">
        <SelectGroup className="bg-background text-accent z-50">
          {names.map((name, index) => (
            <SelectItem
              key={index}
              value={name}
              className="hover:!bg-primary hover:!text-white !text-accent !bg-transparent"
            >
              {name}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};
