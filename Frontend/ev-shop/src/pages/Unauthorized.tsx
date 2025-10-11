import { Link, useNavigate } from 'react-router-dom';

const UnauthorizedPage = () => {
  const navigate = useNavigate();

  // Function to navigate to the previous page
  const goBack = () => navigate(-1);

  return (
    <div className="bg-gray-100 flex flex-col items-center justify-center min-h-screen text-center p-8 font-sans">
      
      {/* Lock Icon with Animation */}
      <div className="w-24 h-24 text-red-500 mb-6 animate-bounce">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 1.5A5.25 5.25 0 006.75 6.75v3.75H6a2.25 2.25 0 00-2.25 2.25v7.5A2.25 2.25 0 006 22.5h12a2.25 2.25 0 002.25-2.25v-7.5a2.25 2.25 0 00-2.25-2.25h-.75V6.75A5.25 5.25 0 0012 1.5zM8.25 6.75a3.75 3.75 0 017.5 0v3.75H8.25V6.75z" />
        </svg>
      </div>
      
      {/* Text Content */}
      <h1 className="text-5xl font-bold text-slate-800 mb-2">
        Access Denied
      </h1>
      <p className="text-lg text-gray-600 max-w-md mb-8">
        Sorry, you don't have the required permissions to view this page.
      </p>

      {/* Action Buttons */}
      <div className="flex gap-4">
        <button 
          onClick={goBack} 
          className="py-3 px-6 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 hover:-translate-y-0.5 hover:shadow-lg transition-all duration-300"
        >
          Go Back
        </button>
        <Link 
          to="/" 
          className="py-3 px-6 bg-transparent text-blue-600 font-semibold border-2 border-blue-600 rounded-lg hover:bg-blue-600 hover:text-white transition-all duration-300"
        >
          Return to Homepage
        </Link>
      </div>
      
    </div>
  );
};

export default UnauthorizedPage;