interface Option {
  id: string | number;
  name: string;
}

interface FormSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  name: string;
  options: Option[];
}

export const FormSelectField: React.FC<FormSelectProps> = ({
  label,
  name,
  options,
  className = "",
  ...props
}) => {
  return (
    <div className="flex flex-col relative">
      <label
        htmlFor={name}
        className="mb-2 text-gray-700 dark:text-gray-300 text-base font-medium"
      >
        {label}
      </label>
      <select
        id={name}
        name={name}
        {...props}
        className={`w-full appearance-none px-4 py-3 text-lg rounded-xl border border-gray-300 dark:border-gray-600 
                    bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 
                    focus:ring-2 focus:ring-blue-500 focus:outline-none shadow-sm 
                    transition duration-200 pr-10 ${className}`}
      >
        {options.map((opt) => (
          <option key={opt.id} value={opt.id}>
            {opt.name}
          </option>
        ))}
      </select>

      {/* Dropdown Icon */}
      <div className="pointer-events-none absolute right-4 top-15 transform -translate-y-1/2">
        <svg
          className="w-6 h-6 text-gray-500 dark:text-gray-300"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 9l6 6 6-6" />
        </svg>
      </div>
    </div>
  );
};
