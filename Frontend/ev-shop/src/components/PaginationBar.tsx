type PaginationProps = {
  totalPages: number;
  currentPage: number;
  handlePageChange: (page: number) => void;
};

export const Pagination: React.FC<PaginationProps> = ({
  totalPages,
  currentPage,
  handlePageChange,
}) => {
  if (totalPages <= 1) return null; // no need to render for single page

  return (
    <div className="flex justify-center mt-10 space-x-2">
      {Array.from({ length: totalPages }, (_, index) => {
        const page = index + 1;
        return (
          <button
            key={page}
            onClick={() => handlePageChange(page)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
              currentPage === page
                ? "bg-blue-600 text-white shadow-md"
                : "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-blue-500 hover:text-white"
            }`}
          >
            {page}
          </button>
        );
      })}
    </div>
  );
};
