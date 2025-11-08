interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  name: string;
  error?: string | number;
}

export const FormInputField: React.FC<FormInputProps> = ({
  label,
  name,
  className = "",
  error,
  ...props
}) => {
  const errorBorderClass = error
    ? "border-red-500 focus:border-red-500 focus:ring-red-500"
    : "border-gray-300 dark:border-gray-600 focus:ring-blue-500";
  return (
    <div className="flex flex-col relative pb-4">
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
        className={`w-full px-4 py-3 text-lg rounded-xl border 
                    bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 
                    focus:ring-2 focus:outline-none shadow-sm 
                    transition duration-200 ${errorBorderClass} ${className}`}
      />
      {error && (
        <p className="absolute -bottom-4 left-4.5 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
};
