"use client";
import { InputTypes, Routes } from "@/constants/enums";
import useFormFields from "@/hooks/useFormFields";
import { IFormField } from "@/types/app";
// this component will be sharable between admin and profile

import { Translations } from "@/types/translations";
// import { User } from "../../../generated/prisma";
import { Session } from "next-auth";
import Image from "next/image";
import FormFields from "../form-fields/form-fields";
import { UserRole } from "../../../generated/prisma";
import { Button } from "../ui/button";
import { useSession } from "next-auth/react";
import { useActionState, useEffect, useState } from "react";
import { ValidationErrors } from "@/validations/auth";
import { updateProfile } from "./_action/profile";
import Loader from "../ui/loader";
import { CameraIcon } from "lucide-react";
import { toast } from "sonner";
import Checkbox from "../form-fields/checkbox";

const EditUserForm = ({
  translations,
  user,
}: {
  translations: Translations;
  //   you can get the user in two ways :
  //   user: User;
  user: Session["user"];
}) => {
  // i make the form field , repeat the same steps of login and signup form
  const { getFormFields } = useFormFields({
    slug: Routes.PROFILE,
    translation: translations,
  });
  // here i execute the action in client side , so use " useSession " for getting session
  const session = useSession();

  // dealing with form action
  const formData = new FormData();
  // now i will append the name to formData , to start using it down in the default value
  // formData.append("name", user.name);
  // but i will not do the previous append to all inputs , so :
  Object.entries(user).forEach(([key, value]) => {
    // check that there is value
    // يعني مثلا رقم الجوال لو ما كان اله قيمة فما بيلزم اضيفه هان و هكذا
    // الصورة انا بتحكم فيها تحت عن طريق الستايت , لذلك مش لازم اتحكم فيها هان
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
    formData,
  };
  // هان عملت ستايت في حال كان المستحدم ادمن بترجع ترووو
  const [isAdmin, setIsAdmin] = useState(user.role === UserRole.ADMIN);
  // بدي ارسل انه هل ادمن او لا للسيرفر فنكشن لحتى اخزنها في الداتا بيز
  // و في الفنكشن هناك بمررها كأنها argument
  const [state, action, pending] = useActionState(
    // القيمة الاولى الها بتكون نل و بعدين برسل الادمن يلي بتكون ترو او فولس
    updateProfile.bind(null, isAdmin),
    initialState
  );

  // now here i will create state for image , it will take user.image as default value , and when user upload another image so the state will change to include the new image

  const [selectedImage, setSelectedImage] = useState(user.image ?? "");

  // هان لما تتعدل البيانات في الستايت راح يظهر الك توست
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

  // هان لحتى اغير الستايت تبع الصورة برضو في كل مرة بتتغير فيها الصورة
  useEffect(() => {
    setSelectedImage(user.image as string);
  }, [user.image]);
  return (
    <form action={action} className="flex flex-col md:flex-row gap-10">
      <div className="group relative w-[200px] h-[200px] overflow-hidden rounded-full mx-auto">
        <Image
          src={selectedImage}
          alt={user.name}
          width={200}
          height={200}
          className="rounded-full object-cover"
        />

        <div
          className={`${
            // here the opacity will be 0 , but when i hover on it the UploadImage will take opacity 1
            selectedImage
              ? "group-hover:opacity-[1] opacity-0  transition-opacity duration-200"
              : ""
          } absolute top-0 left-0 w-full h-full bg-gray-50/40`}
        >
          <UploadImage setSelectedImage={setSelectedImage} />
        </div>
      </div>
      <div className="flex-1">
        {getFormFields().map((field: IFormField) => {
          // the first default value will come from the server
          // يعني لو دخلت بيانات و عملت حفظ بالتالي الاكشن اشتغل , يبقى الداتا هترجع من الستايت
          // *****OR*****
          // if there is no value in state , so return the value from the origin form ( it is above , when i declare the formData and the initial state)
          const fieldValue =
            state?.formData?.get(field.name) ?? formData.get(field.name);
          return (
            <div key={field.name} className="mb-3">
              <FormFields
                {...field}
                defaultValue={fieldValue as string}
                error={state?.error}
                // this readOnly , to prevent user from changing his email
                readOnly={field.type === InputTypes.EMAIL}
              />
            </div>
          );
        })}
        {/* this section will apear only for admin */}
        {session.data?.user.role === UserRole.ADMIN && (
          <div className="flex items-center gap-2 my-4">
            {/* الان بدي ابعت الداتا تبعتها لما اعمل حفظ يبقى في جزئية الاكشن فوق  */}
            <Checkbox
              name="admin"
              checked={isAdmin}
              onClick={() => setIsAdmin(!isAdmin)}
              label="Admin"
            />
          </div>
        )}
        <Button type="submit" className="w-full cursor-pointer">
          {pending ? <Loader /> : translations.save}
        </Button>
      </div>
    </form>
  );
};

export default EditUserForm;

const UploadImage = ({
  setSelectedImage,
}: {
  setSelectedImage: React.Dispatch<React.SetStateAction<string>>;
}) => {
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      // here i get the url of image on my localhost (3000)
      const url = URL.createObjectURL(file);
      setSelectedImage(url);
    }
  };
  return (
    <>
      <input
        type="file"
        accept="image/*"
        // hidden , but i tied the input with label so when chick on label the input will work
        className="hidden"
        id="image-upload"
        // this must match the same name in valodation , to get the data
        name="image"
        onChange={handleImageChange}
      />
      <label
        htmlFor="image-upload"
        className="border rounded-full w-[200px] h-[200px] element-center cursor-pointer"
      >
        <CameraIcon className="!w-8 !h-8 text-accent" />
      </label>
    </>
  );
};
