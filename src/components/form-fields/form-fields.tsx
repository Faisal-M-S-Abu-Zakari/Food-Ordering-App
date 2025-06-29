import { InputTypes } from "@/constants/enums";
import TextField from "./text-field";
import PasswordField from "./password-field";
import { IFormField } from "@/types/app";
import Checkbox from "./checkbox";
import { ValidationErrors } from "@/validations/auth";

// here it will have error and everything in IFormField
interface Props extends IFormField {
  error: ValidationErrors;
}

// here i will make as switch statement according to the type that you extend from IFormField
const FormFields = (props: Props) => {
  const { type } = props;
  // here the function will apply the switch concept
  const renderField = (): React.ReactNode => {
    // InputTypes : from constants/enums file you will have the all input types
    if (type === InputTypes.EMAIL || type === InputTypes.TEXT) {
      return <TextField {...props} />;
    }

    if (type === InputTypes.PASSWORD) {
      return <PasswordField {...props} />;
    }

    if (type === InputTypes.CHECKBOX) {
      // return <Checkbox {...props} />;
    }
    // this is the default if there is another type
    return <TextField {...props} />;
  };

  // then return the function
  return <>{renderField()}</>;
};

export default FormFields;
