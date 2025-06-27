import { Pages } from "@/constants/enums";
import { IFormFieldsVariables, IFormField } from "@/types/app";

// Props interface extends IFormFieldsVariables (which provides 'slug')
// and adds a 'translation' property for localization support.
interface Props extends IFormFieldsVariables {
  translation: any; // Used for translations, can be typed more strictly if needed
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
      label: "Email", // Field label (can be replaced with translation)
      name: "email", // Field name (used in form state)
      type: "email", // Input type
      placeholder: "enter your email", // Placeholder text
      autoFocus: true, // Autofocus this field when form loads
    },
    {
      label: "Password",
      name: "password",
      type: "password",
      placeholder: "enter your password",
      autoFocus: true,
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
