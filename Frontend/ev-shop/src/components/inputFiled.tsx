import React from "react";

// Define the props for the Input component.
// It uses React.InputHTMLAttributes<HTMLInputElement> to accept all standard HTML input attributes
// like `type`, `value`, `onChange`, `placeholder`, etc., ensuring type safety and flexibility.
type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

/**
 * A reusable and styled Input component.
 * This component acts as a wrapper around the standard HTML <input> element,
 * applying consistent styling and allowing for easy customization via props.
 *
 * @param {InputProps} { className, ...props } - Destructures the props.
 *   - `className`: Allows for additional CSS classes to be passed from the parent to override or extend styles.
 *   - `...props`: Spreads all other standard input attributes (like `id`, `type`, `value`, `onChange`) onto the input element.
 */
const Input: React.FC<InputProps> = ({ className, ...props }) => {
  return (
    <input
      {...props}
      className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${className}`}
    />
  );
};

export default Input;
