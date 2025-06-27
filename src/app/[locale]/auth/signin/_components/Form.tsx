"use client";

import FormFields from "@/components/form-fields/form-fields";
import { Button } from "@/components/ui/button";
import { Pages } from "@/constants/enums";
import useFormFields from "@/hooks/useFormFields";
import { IFormField } from "@/types/app";

const Form = () => {
  const { getFormFields } = useFormFields({
    slug: Pages.LOGIN,
    translation: {},
  });
  return (
    <form>
      {getFormFields().map((filed: IFormField) => (
        <div key={filed.name} className="mb-3">
          <FormFields {...filed} error={{}} />
        </div>
      ))}
      <Button type="submit" className="w-full">
        Login
      </Button>
    </form>
  );
};

export default Form;
