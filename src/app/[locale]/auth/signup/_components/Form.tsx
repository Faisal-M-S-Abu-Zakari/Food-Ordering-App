"use client";
import FormFields from "@/components/form-fields/form-fields";
import { Button } from "@/components/ui/button";
import Loader from "@/components/ui/loader";
import { Pages, Routes } from "@/constants/enums";
import useFormFields from "@/hooks/useFormFields";
import { signup } from "@/server/_actions/auth";
import { IFormField } from "@/types/app";
import { Translations } from "@/types/translations";
import { ValidationErrors } from "@/validations/auth";
import { useParams, useRouter } from "next/navigation";
import { useActionState, useEffect } from "react";
import { toast } from "sonner";

interface IState {
  message?: string;
  error?: ValidationErrors;
  status: number | null;
  formData: FormData | null;
}

const initialState: IState = {
  message: "",
  error: {},
  status: null,
  formData: null,
};

const Form = ({ translations }: { translations: Translations }) => {
  // at the end i need it to redirect to login page
  const router = useRouter();
  const { locale } = useParams();
  const { getFormFields } = useFormFields({
    slug: Pages.Register,
    translation: translations,
  });
  //   state ==> determine the state , like errors or success messages
  //   action ==> the action that execute on form
  //   then it take two thing :
  //   1- the function that will work in server , when i declare it , it must have formData attribute as second parameter , and prevState which is not important now
  //   2- initial state
  const [state, action, pending] = useActionState(signup, initialState);
  // i use it to render the toast according to status and message
  //  i should use state.message because in the zod validation it doesn't has message so if i didn't add state.message to the condition and to the dependency list the validation will make conflict
  // بالعامية انا بدي اياها تطلع الرسالة لما يكون الخطأ بجزئية الداتا بيز مش الفاليديشن
  useEffect(() => {
    if (state.status && state.message) {
      toast(state.message, {
        className: state.status === 201 ? "text-green-400" : "text-destructive",
      });
    }
    if (state.status === 201) {
      // you can use push if you like , in the signin form i use push
      // and i should determine the locale
      // then add the router and locale to dependency list
      router.replace(`/${locale}/${Routes.AUTH}/${Pages.LOGIN}`);
    }
  }, [locale, router, state.status && state.message]);
  return (
    <form action={action}>
      {getFormFields().map((field: IFormField) => {
        // الفكرة تبعت اه يحتفظ بالبيانات المدخلة يلي شرحتها في السيرفر فنكشن تبعت انشاء الحساب , بدي اطبقها هان بحيث يبعتهم بشكل داينميك
        // 1- store each field value ,  then pass it as default value
        const fieldValue = state.formData?.get(field.name) as string;
        return (
          <div key={field.name} className="mb-3">
            <FormFields
              {...field}
              error={state.error}
              defaultValue={fieldValue}
            />
          </div>
        );
      })}
      <Button
        type="submit"
        disabled={pending}
        className="w-full cursor-pointer"
      >
        {pending ? <Loader /> : translations.auth.register.submit}
      </Button>
    </form>
  );
};

export default Form;
