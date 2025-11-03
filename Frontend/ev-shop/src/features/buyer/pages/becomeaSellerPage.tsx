import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { CloseIcon } from "@/assets/icons/icons";

/**
 * A component for a "Become a Seller" registration form.
 * Renders as a modal overlay.
 */
const BecomeSellerPage: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { getUserID } = useAuth();

  const [formData, setFormData] = useState({
    business_name: "",
    license_number: "",
    description: "",
    website: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState("");

  /**
   * Handles changes for all form inputs.
   */
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  /**
   * Handles the form submission.
   */
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccessMessage("");

    // Construct the payload based on the SellerDTO
    const sellerData = {
      ...formData,
      user_id: getUserID(), // Add the required user_id from context
    };
    console.log("Submitting seller application:", sellerData);

    try {
      // --- SIMULATED API CALL ---
      // Replace this with your actual fetch call
      // Example:
      // const response = await fetch('/api/v1/seller/register', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //     'Authorization': `Bearer ${your_auth_token}`
      //   },
      //   body: JSON.stringify(sellerData),
      // });
      //
      // if (!response.ok) {
      //   const errorData = await response.json();
      //   throw new Error(errorData.message || 'Failed to register');
      // }
      //
      // const result = await response.json();

      // Simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Simulate a successful response
      console.log("API Success:", { success: true, data: sellerData });
      setSuccessMessage(
        "Your seller application has been submitted successfully!"
      );

      // Clear the form on success
      setFormData({
        business_name: "",
        license_number: "",
        description: "",
        website: "",
      });
    } catch (err: any) {
      console.error("Submission failed:", err);
      setError(
        err.message || "An unexpected error occurred. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

 return (
  // --- MODAL OVERLAY ---
  <div
    className="fixed inset-0 bg-black/30 backdrop-blur-md z-50 flex justify-center items-center p-4 sm:p-6 lg:p-8 animate-fadeIn"
    onClick={onClose}
  >
    {/* --- MODAL CONTENT --- */}
    <div
      className="w-full max-w-2xl bg-white dark:bg-gray-900 rounded-xl shadow-2xl relative flex flex-col animate-fadeInUp"
      onClick={(e) => e.stopPropagation()}
    >
      {/* --- STICKY HEADER --- */}
      <div className="sticky top-0 z-10 bg-white dark:bg-gray-900 px-8 py-5 text-center rounded-t-xl border-b border-gray-200 dark:border-gray-700 shadow-sm">
        <button
          onClick={onClose}
          className="absolute top-5 right-6 p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition"
          aria-label="Close modal"
        >
          <CloseIcon className="h-6 w-6" />
        </button>

        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Become a Seller
        </h1>
        <p className="mt-2 text-md text-gray-600 dark:text-gray-300">
          Fill out the details below to register your business on our platform.
        </p>
      </div>

      {/* --- SCROLLABLE FORM --- */}
      <div className="px-8 py-6 overflow-y-auto max-h-[75vh]">
        <form className="space-y-6" onSubmit={handleSubmit}>
          {/* Business Name */}
          <div>
            <label
              htmlFor="business_name"
              className="block text-sm font-medium text-gray-700 dark:text-gray-200"
            >
              Business Name <span className="text-red-500">*</span>
            </label>
            <input
              id="business_name"
              name="business_name"
              type="text"
              value={formData.business_name}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 mt-2 text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
              placeholder="e.g., Acme Auto Parts"
            />
          </div>

          {/* License Number */}
          <div>
            <label
              htmlFor="license_number"
              className="block text-sm font-medium text-gray-700 dark:text-gray-200"
            >
              Business License Number (Optional)
            </label>
            <input
              id="license_number"
              name="license_number"
              type="text"
              value={formData.license_number}
              onChange={handleChange}
              className="w-full px-4 py-3 mt-2 text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
              placeholder="e.g., 12345-ABC"
            />
          </div>

          {/* Website */}
          <div>
            <label
              htmlFor="website"
              className="block text-sm font-medium text-gray-700 dark:text-gray-200"
            >
              Website (Optional)
            </label>
            <input
              id="website"
              name="website"
              type="url"
              value={formData.website}
              onChange={handleChange}
              className="w-full px-4 py-3 mt-2 text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
              placeholder="https://www.yourbusiness.com"
            />
          </div>

          {/* Description */}
          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700 dark:text-gray-200"
            >
              Business Description (Optional)
            </label>
            <textarea
              id="description"
              name="description"
              rows={4}
              value={formData.description}
              onChange={handleChange}
              className="w-full px-4 py-3 mt-2 text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
              placeholder="Briefly describe what your business sells or does..."
            />
          </div>

          {/* Alerts */}
          {error && (
            <div
              className="px-4 py-3 text-sm text-red-700 bg-red-100 border border-red-300 rounded-lg"
              role="alert"
            >
              <span className="font-medium">Error:</span> {error}
            </div>
          )}

          {successMessage && (
            <div
              className="px-4 py-3 text-sm text-green-700 bg-green-100 border border-green-300 rounded-lg"
              role="alert"
            >
              <span className="font-medium">Success:</span> {successMessage}
            </div>
          )}

          {/* Submit */}
          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full px-6 py-3 font-semibold text-white bg-blue-600 rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-300"
            >
              {isLoading ? "Submitting Application..." : "Submit Application"}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
);


};

export default BecomeSellerPage;
