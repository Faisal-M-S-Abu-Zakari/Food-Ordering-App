import { IFormField } from "@/types/app";
import { useState } from "react";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { ValidationErrors } from "@/validations/auth";
import { useParams } from "next/navigation";
import { Languages } from "@/constants/enums";

interface Props extends IFormField {
  error: ValidationErrors;
}
interface IState {
  showPassword: boolean;
}

// here at first it will be EyeOff
const INITIAL_STATE: IState = { showPassword: false };

const PasswordField = ({
  label,
  name,
  placeholder,
  disabled,
  autoFocus,
  error,
  defaultValue,
}: Props) => {
  // this state for eye to off it or on
  const [state, setState] = useState(INITIAL_STATE);
  const { showPassword } = state;
  // to change the eye position when locale change
  const { locale } = useParams();
  // function that will work in button click
  const handleClickShowPassword = () =>
    setState((prevState) => ({
      // ملهاش داعي ولكن لو حبيت تضيف اشي بالمستقبل على initial state
      // بتضيف بدون ما تعدل على الفنكشن
      ...prevState,
      // هان هي الاساس و هي عكس قيمة ال showPassword
      showPassword: !prevState.showPassword,
    }));

  // to stop the default action on this button when mouse leave it
  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };
  // this component look like the text-field but add the Eye's button

  return (
    <div className="space-y-2">
      <Label htmlFor={name} className="capitalize text-black">
        {label}
      </Label>
      <div className="relative flex items-center">
        <Input
          // the default that type will be password which mean that it is hidden , to make the password visiable then change the type to text
          type={showPassword ? "text" : "password"}
          placeholder={placeholder}
          disabled={disabled}
          autoFocus={autoFocus}
          autoComplete="off"
          name={name}
          id={name}
          defaultValue={defaultValue}
        />

        <button
          type="button"
          onClick={handleClickShowPassword}
          onMouseDown={handleMouseDownPassword}
          className={`absolute ${
            locale === Languages.ARABIC ? "left-3" : "right-3"
          }`}
        >
          {showPassword ? (
            <EyeOffIcon className="h-4 w-4" />
          ) : (
            <EyeIcon className="h-4 w-4" />
          )}
        </button>
      </div>
      {error && error[name] && (
        <p
          className={`text-accent mt-2 text-sm font-medium ${
            error[name] ? "text-destructive" : ""
          }`}
        >
          {error[name]}
        </p>
      )}
    </div>
  );
};

export default PasswordField;
