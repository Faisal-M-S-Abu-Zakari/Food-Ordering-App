import { Pages, Routes } from "@/constants/enums";
import { IFormFieldsVariables, IFormField } from "@/types/app";
import { Translations } from "@/types/translations";

// Props interface extends IFormFieldsVariables (which provides 'slug')
// and adds a 'translation' property for localization support.
interface Props extends IFormFieldsVariables {
  translation: Translations; // Used for translations, can be typed more strictly if needed
}

/**
 * Custom hook to generate form field configurations based on the page slug.
 *
 * @param {Props} props - Contains the slug (to determine the form type) and translation object.
 * @returns {Object} - An object with a getFormFields function that returns an array of form field configs.
 */
const useFormFields = ({ slug, translation }: Props) => {
  // Returns an array of form field configs for the login form.
  // Each object describes a single input field.
  const loginFields = (): IFormField[] => [
    {
      label: translation.auth.login.email.label, // Field label (can be replaced with translation)
      name: "email", // Field name (used in form state)
      type: "email", // Input type
      placeholder: translation.auth.login.email.placeholder, // Placeholder text
      autoFocus: true, // Autofocus this field when form loads
    },
    {
      label: translation.auth.login.password.label,
      name: "password",
      type: "password",
      placeholder: translation.auth.login.password.placeholder,
    },
  ];
  const signUpFields = (): IFormField[] => [
    {
      label: translation.auth.register.name.label,
      name: "name",
      type: "text",
      placeholder: translation.auth.register.name.placeholder,
      autoFocus: true,
    },
    {
      label: translation.auth.register.email.label,
      name: "email",
      type: "email",
      placeholder: translation.auth.register.email.placeholder,
    },
    {
      label: translation.auth.register.password.label,
      name: "password",
      type: "password",
      placeholder: translation.auth.register.password.placeholder,
    },
    {
      label: translation.auth.register.confirmPassword.label,
      name: "confirmPassword",
      type: "password",
      placeholder: translation.auth.register.confirmPassword.placeholder,
    },
  ];
  // this is the profile form fields
  const profileFields = (): IFormField[] => [
    {
      label: translation.profile.form.name.label,
      name: "name",
      type: "text",
      placeholder: translation.profile.form.name.placeholder,
      autoFocus: true,
    },
    {
      label: translation.profile.form.email.label,
      name: "email",
      type: "email",
      placeholder: translation.profile.form.email.placeholder,
    },
    {
      label: translation.profile.form.phone.label,
      name: "phone",
      type: "text",
      placeholder: translation.profile.form.phone.placeholder,
    },
    {
      label: translation.profile.form.address.label,
      name: "streetAddress",
      type: "text",
      placeholder: translation.profile.form.address.placeholder,
    },
    {
      label: translation.profile.form.postalCode.label,
      name: "postalCode",
      type: "text",
      placeholder: translation.profile.form.postalCode.placeholder,
    },
    {
      label: translation.profile.form.city.label,
      name: "city",
      type: "text",
      placeholder: translation.profile.form.city.placeholder,
    },
    {
      label: translation.profile.form.country.label,
      name: "country",
      type: "text",
      placeholder: translation.profile.form.country.placeholder,
    },
  ];
  const addProductFields = (): IFormField[] => [
    {
      label: translation.admin["menu-items"].form.name.label,
      name: "name",
      type: "text",
      placeholder: translation.admin["menu-items"].form.name.placeholder,
      autoFocus: true,
    },
    {
      label: translation.admin["menu-items"].form.description.label,
      name: "description",
      type: "text",
      placeholder: translation.admin["menu-items"].form.description.placeholder,
    },
    {
      label: translation.admin["menu-items"].form.basePrice.label,
      name: "basePrice",
      type: "text",
      placeholder: translation.admin["menu-items"].form.basePrice.placeholder,
    },
  ];
  /**
   * Returns the appropriate form fields array based on the slug.
   * Extend this switch to support more forms (e.g., signup, forgot password).
   */
  const getFormFields = (): IFormField[] => {
    switch (slug) {
      case Pages.LOGIN:
        return loginFields();
      // Add more cases for other forms as needed
      case Pages.Register:
        return signUpFields();
      case Routes.PROFILE:
        return profileFields();
      case `${Routes.ADMIN}/${Pages.MENU_ITEMS}`:
        return addProductFields();
      default:
        return []; // Return empty array if no matching form
    }
  };

  // Expose the getFormFields function for use in components
  return {
    getFormFields,
  };
};

export default useFormFields;
