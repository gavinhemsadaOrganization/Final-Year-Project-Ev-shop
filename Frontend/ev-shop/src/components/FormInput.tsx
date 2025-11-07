interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  name: string;
}

export const FormInputField: React.FC<FormInputProps> = ({ label, name, className = "", ...props }) => {
  return (
    <div className="flex flex-col">
      <label
        htmlFor={name}
        className="mb-2 text-gray-700 dark:text-gray-300 text-base font-medium"
      >
        {label}
      </label>
      <input
        id={name}
        name={name}
        {...props}
        className={`w-full px-4 py-3 text-lg rounded-xl border border-gray-300 dark:border-gray-600 
                    bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 
                    focus:ring-2 focus:ring-blue-500 focus:outline-none shadow-sm 
                    transition duration-200 ${className}`}
      />
    </div>
  );
};
