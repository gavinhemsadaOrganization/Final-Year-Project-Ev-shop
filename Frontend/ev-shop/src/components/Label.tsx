import type React from "react";

// Define the props interface for the Label component.
// This ensures type safety for the component's properties.
type LabelProps = {
  htmlFor: string;
  children: React.ReactNode;
  className?: string;
};

/**
 * A reusable and styled Label component.
 * This component wraps the standard HTML <label> element, applying consistent
 * styling and ensuring it's correctly associated with a form input via the `htmlFor` prop.
 *
 * @param {LabelProps} { htmlFor, children, className } - The properties for the label.
 */
const Label: React.FC<LabelProps> = ({ htmlFor, children, className }) => {
  return (
    <label
      htmlFor={htmlFor}
      className={`block text-sm font-medium text-gray-700 ${className}`}
    >
      {children}
    </label>
  );
};

export default Label;
