// هذه الصفحة من خلالها هتضيف اسم و وصف و سعر و صنف و الاحجام و المكونات و الصورة للمنتج
// بتشبه صفحة البروفايل تقريبا مع اختلاف بعض الفنكشناليتي

"use client";

import FormFields from "@/components/form-fields/form-fields";
import { Button, buttonVariants } from "@/components/ui/button";
import { Pages, Routes } from "@/constants/enums";
import useFormFields from "@/hooks/useFormFields";
import { IFormField } from "@/types/app";
import { Translations } from "@/types/translations";
import { CameraIcon } from "lucide-react";
import Image from "next/image";
import { useActionState, useEffect, useState } from "react";

import Link from "@/components/link";
import { useParams } from "next/navigation";
import { ValidationErrors } from "@/validations/auth";
import Loader from "@/components/ui/loader";
import { Category, Extra, Size } from "../../../../../../generated/prisma";
import { productWithRelations } from "@/types/product";
import { toast } from "sonner";
import SelectCategory from "./SelectCategory";
import { addProduct, deleteProduct, updateProduct } from "../_actions/product";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import ItemOptions, { ItemOptionsKeys } from "./ItemOptions";

function Form({
  translations,
  categories,
  product,
}: {
  translations: Translations;
  categories: Category[];
  // طبعا هان عملتها تكون اختياري لانه المنتج فقط مطلوب لما تعمل تعديل و لكن في حالة إنشاء المنتج فأنا اساسا ما عندي منتج امرره
  // لاحظ انه التايب تبع ليس برودكت و انما استخدمت الريلايشنس لحتى اقدر اوصل للاحجام و الاضافات
  product?: productWithRelations;
}) {
  // طبعا انا عرفتها هان كستايت و ما عرفتها تحت في الكومبونينت تبعها لانه بدي امررها للسيرفر اكشن داخل الفورم
  const [selectedImage, setSelectedImage] = useState(
    // هان انا استخدمت المنتج كشرط لانه هاد الفورم راح يظهر في حال اضافة او تحديث المنتج
    // يبقى بالبداية هيكون فش منتج يعني سترينج فاضي و وقت التحديث هيكون في منتج و هتكون صورته هي المعروضة
    product ? product.image : ""
  );

  // here i will take the category id only , not all the category
  // then pass the category id to form server action
  const [categoryId, setCategoryId] = useState(
    // القيمة الافتراضية هتكون اول صنف موجود ولكن في حال وجود منتج يعني بدك تعمل تحديث للمنتح هتكون قيمة المنتجة المختارة مسبقا هي الصنف تبعه
    product ? product.categoryId : categories[0].id
  );
  // this is the state that i will pass it to AddSize component to store the sizes in it , then pass the sizes to server function
  const [sizes, setSizes] = useState<Partial<Size>[]>(
    // at the begining there is no sizes , it's empty array
    product ? product.sizes : []
  );
  const [extras, setExtras] = useState<Partial<Extra>[]>(
    product ? product.extras : []
  );
  // هان بستخدم الهوك تبعتي لحتى اعمل ريندر للانبت
  const { getFormFields } = useFormFields({
    slug: `${Routes.ADMIN}/${Pages.MENU_ITEMS}`,
    translation: translations,
  });

  // نفس فكرة البروفايل
  const formData = new FormData();

  // بالبداية انا مش هضيف اي حاجة لانه هيكون اوبجيكت فارغ و وقت التعديل على البيانات هيكون عندي منتج و بعدل عليه
  // Object.entries({}) ==> هيك بتكون في حالة الاضافة ولكن لما تعدل على منتج يبقى لازم تضيف قبل الاوبجيكت شرط وجود المنتج زي يلي تحت بالزبط
  Object.entries(product ?? {}).forEach(([key, value]) => {
    if (value !== null && value !== undefined && key !== "image") {
      formData.append(key, value.toString());
    }
  });

  const initialState: {
    message?: string;
    error?: ValidationErrors;
    status?: number | null;
    formData?: FormData | null;
  } = {
    message: "",
    error: {},
    status: null,
    formData: null,
  };

  const [state, action, pending] = useActionState(
    // if ther is product then the update function wil work
    product
      ? // طبعا التعديل بيصير بناء على اي دي
        // و الاي دي ما ببعته من الفورم يبقى بمرره من الارجيمنتس
        updateProduct.bind(null, {
          productId: product.id,
          options: { sizes, extras },
        })
      : // here i will send the categoryId as arguments to tied the product with the correct category ==> get the categoryId from state above
        addProduct.bind(null, { categoryId, options: { sizes, extras } }),
    initialState
  );

  // هان فقط لحتى يظهر التوست لما تضيف العنصر
  useEffect(() => {
    if (state.message && state.status && !pending) {
      toast(
        <span
          className={
            // 201 for create product , 200 for update product
            `${state.status === 201 || state.status === 200} `
              ? "text-green-400"
              : "text-destructive"
          }
        >
          {state.message}
        </span>
      );
    }
  }, [pending, state.message, state.status]);
  return (
    // الفورم مقسوم لقسمين : الاول للصورة والثاني لحقول الادخال بحيث هيكون فليكس 1 ليكون ماخد معظم المساحة
    <form action={action} className="flex flex-col md:flex-row gap-10">
      <div>
        <UploadImage
          selectedImage={selectedImage}
          setSelectedImage={setSelectedImage}
        />
        {/* here will render the image error , if user didn't upload image :  */}
        {state?.error?.image && (
          <p className="text-sm text-destructive text-center mt-4 font-medium">
            {state.error?.image}
          </p>
        )}
      </div>

      <div className="flex-1">
        {getFormFields().map((field: IFormField) => {
          // after i make the entries() i should render rhe default here
          const fieldValue =
            // state.formData?.get(field.name) ==> the data will return from serve if user made any action
            // formData.get(field.name) ==> لكن في حالة البداية برجع البيانات يلي بالفورم قبل اي اكشن
            state.formData?.get(field.name) ?? formData.get(field.name);

          return (
            <div key={field.name} className="mb-3">
              <FormFields
                {...field}
                error={state?.error}
                defaultValue={fieldValue as string}
              />
            </div>
          );
        })}
        <SelectCategory
          categoryId={categoryId}
          categories={categories}
          setCategoryId={setCategoryId}
          translations={translations}
        />
        <AddSize
          translations={translations}
          sizes={sizes}
          setSizes={setSizes}
        />
        <AddExtras
          extras={extras}
          setExtras={setExtras}
          translations={translations}
        />
        <FormActions
          translations={translations}
          pending={pending}
          product={product}
        />
      </div>
    </form>
  );
}

export default Form;

// هذا الكومبونينت هيعمل ريندر للصورة اذا موجودة او للانبت لحتى ترفع الصورة
// في البروفايل انا عملت نفس الشي تقريبا , لكن هناك انا فصلت الصورة عن الانبت و هان جمعتهم بنفس الكومبونينت
const UploadImage = ({
  selectedImage,
  setSelectedImage,
}: {
  selectedImage: string;
  setSelectedImage: React.Dispatch<React.SetStateAction<string>>;
}) => {
  // برضو هان نفس فكرة البوفايل انه بتحفظ الفايل تبع الصورة لحتى تمرره للسيرفر اكشن
  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files && event.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setSelectedImage(url);
    }
  };
  return (
    <div className="group mx-auto md:mx-0 relative w-[200px] h-[200px] overflow-hidden rounded-full">
      {selectedImage && (
        <Image
          src={selectedImage}
          alt="Add Product Image"
          width={200}
          height={200}
          className="rounded-full object-cover"
        />
      )}
      <div
        className={`${
          selectedImage
            ? "group-hover:opacity-[1] opacity-0  transition-opacity duration-200"
            : ""
        } absolute top-0 left-0 w-full h-full bg-gray-50/40`}
      >
        <input
          type="file"
          accept="image/*"
          className="hidden"
          id="image-upload"
          onChange={handleImageChange}
          name="image"
        />
        <label
          htmlFor="image-upload"
          className="border rounded-full w-[200px] h-[200px] element-center cursor-pointer"
        >
          <CameraIcon className="!w-8 !h-8 text-accent" />
        </label>
      </div>
    </div>
  );
};

// الزر الموجود هيكون اما حفظ او تعديل او حذف , يبقى عندي 3 اكشن
const FormActions = ({
  translations,
  pending,
  product,
}: {
  translations: Translations;
  pending: boolean;
  // here i make it optional becuase the product may not found
  product?: productWithRelations;
}) => {
  const { locale } = useParams();
  // this state will include a lot of data
  // 1- pending ==> to handel the buttons
  // 2- status  ==> to make conditions in useEffecct
  // 3- message ==> that will render in useEffect inside toast
  const [state, setState] = useState<{
    pending: boolean;
    status: null | number;
    message: string;
  }>({
    pending: false,
    status: null,
    message: "",
  });
  // هان هتاخد منك الاي دي  لحتى تمسح المنتج
  // it should be async , because i call DB inside it
  const handleDelete = async (id: string) => {
    try {
      // بالبداية بتخلي البيندق قيمتها تروو
      setState((prev) => {
        return { ...prev, pending: true };
      });
      // هان بتنادي على الاكشن يلي هيحذف العنصر من الداتا بيز
      const res = await deleteProduct(id);
      // here i will change the status according to the result from server function
      // and return the message to render it in toast
      setState((prev) => {
        return { ...prev, status: res.status, message: res.message };
      });
      // if ther is error
    } catch (error) {
      console.log(error);
      // and finally stop the pending
    } finally {
      setState((prev) => {
        return { ...prev, pending: false };
      });
    }
  };
  // هان كل الفكرة منها انه يطلع توست لما يصير التعديل او الانشاء
  useEffect(() => {
    if (state.message && state.status && !pending) {
      toast(
        <span
          className={
            `${state.status === 200}` ? "text-green-400" : "text-destructive"
          }
        >
          {state.message}
        </span>
      );
    }
  }, [pending, state.message, state.status]);
  return (
    <>
      <div
        // هان برضو قسمت التصميم بناء على وجود منتج او لا
        // وجود منتج تعني انت بصفحة التعديل , عدم وجود منتج تعني انك بصفحة انشاء
        className={`${product ? "grid grid-cols-2" : "flex flex-col"} gap-4`}
      >
        <Button type="submit" disabled={pending}>
          {pending ? (
            <Loader />
          ) : // في حال وجود منتج هتكون حفظ للتعديلات ولو ما في هتكون انشاء منتج
          product ? (
            translations.save
          ) : (
            translations.create
          )}
        </Button>
        {/*  الزر هاد هيظهر فقط في صفحة التعديل يعني في حال وجود عنصر فقط  */}
        {/* و طبعا بناء على الاي دي هيحذف المنتج */}
        {product && (
          <Button
            variant="outline"
            disabled={state.pending}
            onClick={() => handleDelete(product.id)}
          >
            {state.pending ? <Loader /> : translations.delete}
          </Button>
        )}
      </div>

      <Link
        href={`/${locale}/${Routes.ADMIN}/${Pages.MENU_ITEMS}`}
        className={`w-full mt-4 ${buttonVariants({ variant: "outline" })}`}
      >
        {translations.cancel}
      </Link>
    </>
  );
};

// it is an accoedine from shadcn ui , when you click on add item size a new li will generate
const AddSize = ({
  sizes,
  setSizes,
  translations,
}: {
  sizes: Partial<Size>[];
  setSizes: React.Dispatch<React.SetStateAction<Partial<Size>[]>>;
  translations: Translations;
}) => {
  return (
    <Accordion
      type="single"
      collapsible
      className="bg-gray-100 rounded-md px-4 w-80 mb-4 "
    >
      <AccordionItem value="item-1" className="border-none">
        <AccordionTrigger className="text-black text-base font-medium hover:no-underline">
          {translations.sizes}
        </AccordionTrigger>
        <AccordionContent>
          {/* هتبعت اله الاحجام و الفنكشن يلي من خلالها هيضيف الحجم على الستايت لما تختار حجم ما */}
          {/* i called it state and setState , because i will use the same component to pass extras and setExtras ===> so i choose a public name  */}
          <ItemOptions
            optionKey={ItemOptionsKeys.SIZES}
            state={sizes}
            setState={setSizes}
            translations={translations}
          />
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

// نفس الشي يلي حكيت عنه فوق بالنسبة للاحجام
const AddExtras = ({
  extras,
  setExtras,
  translations,
}: {
  extras: Partial<Extra>[];
  setExtras: React.Dispatch<React.SetStateAction<Partial<Extra>[]>>;
  translations: Translations;
}) => {
  return (
    <Accordion
      type="single"
      collapsible
      className="bg-gray-100 rounded-md px-4 w-80 mb-4 "
    >
      <AccordionItem value="item-1" className="border-none">
        <AccordionTrigger className="text-black text-base font-medium hover:no-underline">
          {translations.extrasIngredients}
        </AccordionTrigger>
        <AccordionContent>
          <ItemOptions
            state={extras}
            optionKey={ItemOptionsKeys.EXTRAS}
            setState={setExtras}
            translations={translations}
          />
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};
