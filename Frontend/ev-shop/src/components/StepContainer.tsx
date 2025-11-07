export const StepContainer: React.FC<{ title: string; children: React.ReactNode }> = ({
  title,
  children,
}) => (
  <div className="space-y-6">
    <h2 className="text-2xl font-semibold text-gray-900">{title}</h2>
    {children}
  </div>
);