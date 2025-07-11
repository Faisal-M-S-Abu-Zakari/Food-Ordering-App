"use client";

import * as React from "react";

import { Translations } from "@/types/translations";
import { Label } from "@/components/ui/label";
import { Languages } from "@/constants/enums";
import { useParams } from "next/navigation";
import { Category } from "../../../../../../generated/prisma";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

function SelectCategory({
  categories,
  categoryId,
  setCategoryId,
  translations,
}: {
  categories: Category[];
  categoryId: string;
  translations: Translations;
  setCategoryId: React.Dispatch<React.SetStateAction<string>>;
}) {
  const currentItem = categories.find((item) => item.id === categoryId);
  const { locale } = useParams();
  return (
    <>
      <Label htmlFor="categoryId" className="capitalize text-black block mb-3">
        {translations.category}
      </Label>
      <Select
        name="categoryId"
        // لما بدك تغير القيمة , لازم تضيف التغيير على الستايت ايضا
        // القيمة هان عبارة عن الايدي يلي مررتها تحت لما عملت لوب
        onValueChange={(value) => {
          setCategoryId(value);
        }}
        // هان هتكون هي قيمة الستايت يلي مررتها من البروبس
        defaultValue={categoryId}
      >
        {/* هان راح تظهر القيمة الاقتراضية للسيلكت او القيمة المختارة مسبقا في حال التعديل على المنتج */}
        {/* لكن انا مررت الايدي وليس اسم الصنف لذلك بعمل فوق متغير هيعمل لوب على مجموعة الاصناف لحتى الاقي الصنف الحالي و من ثم هان باخد الاسم منه */}
        <SelectTrigger
          className={`w-48 h-10 bg-gray-100 border-none mb-4 focus:ring-0 ${
            locale === Languages.ARABIC ? "flex-row-reverse" : "flex-row"
          }`}
        >
          <SelectValue>{currentItem?.name}</SelectValue>
        </SelectTrigger>
        <SelectContent className="bg-transparent border-none z-50 bg-gray-100">
          <SelectGroup className="bg-background text-accent z-50">
            {categories.map((category) => (
              <SelectItem
                key={category.id}
                // هان انا لما اختار صنف معين فإني بختار الايدي تبعه لانه هو يلي بدي ارسله للسيرفر اكشن
                value={category.id}
                className="hover:!bg-primary hover:!text-white !text-accent !bg-transparent"
              >
                {category.name}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </>
  );
}
export default SelectCategory;
