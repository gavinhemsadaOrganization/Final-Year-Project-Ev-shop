type RoleButtonProps = {
  onClick: () => void;
  title: string;
  icon: React.ReactNode;
  label: string;
  color?: string;
};

const RoleButton: React.FC<RoleButtonProps> = ({
  onClick,
  title,
  icon,
  label,
  color = "bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-400",
}) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-2 px-4 py-2 ${color} text-sm font-medium rounded-full active:scale-95 transition-all duration-200 shadow-sm`}
    title={title}
  >
    {icon}
    <span className="hidden md:inline whitespace-nowrap">{label}</span>
  </button>
);

export default RoleButton;