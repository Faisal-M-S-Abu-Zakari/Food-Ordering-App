export interface IOption {
  label: string;
  value: string;
}
// here the attribute for any input
export interface IFormField {
  name: string;
  label?: string;
  type:
    | "text"
    | "email"
    | "password"
    | "number"
    | "date"
    | "time"
    | "datetime-local"
    | "checkbox"
    | "radio"
    | "select"
    | "hidden"
    | "textarea";
  placeholder?: string;
  disabled?: boolean;
  autoFocus?: boolean;
  options?: IOption;
  id?: string;
  defaultValue?: string;
  readOnly?: boolean;
}
// this interface to determine the slug , to know if it login page or signup page
export interface IFormFieldsVariables {
  slug: string;
}
