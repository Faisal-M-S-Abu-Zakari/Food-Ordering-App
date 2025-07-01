"use client";

import FormFields from "@/components/form-fields/form-fields";
import { Button } from "@/components/ui/button";
import Loader from "@/components/ui/loader";
import { Pages, Routes } from "@/constants/enums";
import useFormFields from "@/hooks/useFormFields";
import { IFormField } from "@/types/app";
import { Translations } from "@/types/translations";
import { signIn } from "next-auth/react";
import { useParams, useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { toast } from "sonner";
const Form = ({ translations }: { translations: Translations }) => {
  const { getFormFields } = useFormFields({
    slug: Pages.LOGIN,
    translation: translations,
  });
  const router = useRouter();
  const { locale } = useParams();
  const [error, setError] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // 1- i need to get the form value
    // before i take the data from ref i should check that it has data
    if (!formRef.current) return;
    // to access the data i make form data that will have all form data
    const formData = new FormData(formRef.current);
    // now i declare the data as record with key and value
    const data: Record<string, string> = {};
    // then i will loop to the formData to store it in data record
    formData.forEach((value, key) => {
      data[key] = value.toString();
    });
    try {
      setIsLoading(true);
      // this function work only in client not server , i import it from next-auth / react ==> the word react means client
      // it take the provider , then the data from form ==> you can make state for them or use the ref wich is better
      // the res will return user or errors that i declare them in authorize fn
      const res = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      });
      // if there is an error
      if (res?.error) {
        // in authorize fn it return two type of error :
        // in authorize i store it as string so i parse it here
        // then this error i will pass it to FormField so i need to store it in state
        const validationError = JSON.parse(res?.error).validationError;
        setError(validationError);
        // the second type of error which is error in DB
        const responseError = JSON.parse(res?.error).responseError;
        if (responseError) {
          toast(<span className="text-destructive">{responseError}</span>);
        }
      }
      // if the result ok , show the toast and redirect to root page
      if (res?.ok) {
        toast(
          <span className="text-green-400">
            {translations.messages.loginSuccessful}
          </span>
        );
        router.push(`/${locale}/${Routes.PROFILE}`);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <form onSubmit={onSubmit} ref={formRef}>
      {getFormFields().map((filed: IFormField) => (
        <div key={filed.name} className="mb-3">
          <FormFields {...filed} error={error} />
        </div>
      ))}
      <Button
        type="submit"
        disabled={isLoading}
        className="w-full cursor-pointer"
      >
        {isLoading ? <Loader /> : translations.auth.login.submit}
      </Button>
    </form>
  );
};

export default Form;
