import React, { useState, useEffect } from "react";
import type { User } from "@/types";
import { Camera } from "lucide-react";
import { buyerService } from "../buyerService";
import { useAuth } from "@/context/AuthContext";
import { Loader } from "@/components/Loader";

const apiURL = import.meta.env.VITE_API_URL;
/**
 * A page component that displays and allows editing of the user's profile information.
 * This component uses controlled inputs to manage form state, new fields, and image previews.
 */
export const UserProfile: React.FC<{ user: User }> = ({ user }) => {
  // --- State for controlled inputs ---
  const [name, setName] = useState(user?.name);
  const [email, _setEmail] = useState(user.email);

  // --- NEW: State for new fields ---
  const [phone, setPhone] = useState(user.phone || "");
  const [dob, setDob] = useState(() => {
    const iso = user.date_of_birth;
    if (!iso) return "";
    return iso.split("T")[0]; // ✅ extract only "YYYY-MM-DD"
  });

  // --- NEW: State for nested address object ---
  const [address, setAddress] = useState({
    street: user.address?.street || "",
    city: user.address?.city || "",
    state: user.address?.state || "",
    zipCode: user.address?.zipCode || "",
    country: user.address?.country || "",
  });

  // --- NEW: State for image preview ---
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isChanged, setIsChanged] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { getUserID } = useAuth();
  /**
   * Handles the file input change event for the profile image.
   */
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setImagePreview(URL.createObjectURL(file));
      setIsChanged(true);
    }
  };

  /**
   * --- NEW: Handler for nested address state ---
   */
  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setIsChanged(true);
    setAddress((prev) => ({ ...prev, [name]: value }));
  };

  const handleChange =
    <T,>(setter: React.Dispatch<React.SetStateAction<T>>) =>
    (value: T) => {
      setIsChanged(true);
      setter(value);
    };

  /**
   * --- NEW: Cleanup effect for the image preview URL ---
   */
  useEffect(() => {
    // Revoke the object URL to prevent memory leaks
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  /**
   * --- NEW: Validation logic ---
   */
  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!name?.trim()) {
      newErrors.name = "Full name is required.";
    }

    // Basic phone validation: allows digits, spaces, and a leading '+'
    const phoneRegex = /^\+?[0-9\s]{10,15}$/;
    if (phone && !phoneRegex.test(phone)) {
      newErrors.phone = "Please enter a valid phone number.";
    }

    if (dob) {
      const birthDate = new Date(dob);
      if (birthDate > new Date()) {
        newErrors.dob = "Date of birth cannot be in the future.";
      }
    }

    // --- NEW: Address validation ---
    if (!address.street.trim()) {
      newErrors.street = "Street is required.";
    }
    if (!address.city.trim()) {
      newErrors.city = "City is required.";
    }
    if (!address.state.trim()) {
      newErrors.state = "State / Province is required.";
    }
    if (!address.zipCode.trim()) {
      newErrors.zipCode = "ZIP / Postal Code is required.";
    } else if (!/^\d{5}(?:[-\s]\d{4})?$/.test(address.zipCode)) {
      newErrors.zipCode = "Please enter a valid postal code.";
    }
    if (!address.country.trim()) {
      newErrors.country = "Country is required.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * --- MODIFIED: Form submission handler with validation ---
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      console.log("Validation failed. Please check the form.");
      return;
    }
    try {
      setIsLoading(true);
      const userID = getUserID();
      const formData = new FormData();
      formData.append("name", name);
      formData.append("phone", phone);
      formData.append("date_of_birth", dob);

      // Handle nested address
      formData.append("address[street]", address.street);
      formData.append("address[city]", address.city);
      formData.append("address[state]", address.state);
      formData.append("address[zipCode]", address.zipCode);
      formData.append("address[country]", address.country);

      // Handle file (only if exists)
      if (selectedFile) {
        formData.append("profile_image", selectedFile);
      }

      await buyerService.updateUserProfile(userID!, formData);
      alert("Profile update submitted!");
      setIsChanged(false); // --- NEW: Reset change tracking to disable the button ---
    } catch (error) {
      console.error("Failed to update profile:", error);
      alert("Failed to update profile. Please try again.");
    } finally {
      setIsLoading(false); // --- Ensure loading is always turned off
    }
  };

  return (
    <div className="bg-white p-8 rounded-xl shadow-md max-w-6xl mx-auto dark:bg-gray-800 dark:shadow-none dark:border dark:border-gray-700">
      <h1 className="text-3xl font-bold mb-6 dark:text-white">My Profile</h1>

      {/* --- NEW: Form element wraps inputs --- */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Profile header section */}
        <div className="flex items-center space-x-6">
          <div className="flex flex-col items-center">
            <div
              className="relative group h-24 w-24 rounded-full border-2 border-gray-200 shadow-md overflow-hidden cursor-pointer"
              onClick={() =>
                document.getElementById("profile-image-upload")?.click()
              }
            >
              {imagePreview || user.profile_image ? (
                <img
                  src={imagePreview || ` ${apiURL}${user.profile_image}`}
                  alt="User Avatar"
                  className="h-full w-full object-cover rounded-full"
                />
              ) : (
                <div className="h-9 w-9 sm:h-24 sm:w-24 rounded-full bg-gray-300 dark:bg-gray-700 flex items-center justify-center text-gray-700 dark:text-gray-400 font-semibold text-4xl">
                  {user.name
                    ? user.name
                        .split(" ")
                        .map((n: any) => n[0]?.toUpperCase())
                        .slice(0, 2)
                        .join("")
                    : "?"}
                </div>
              )}

              {/* Hover overlay with icon */}
              <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-300">
                <Camera className="text-gray-200" />
              </div>
            </div>

            {/* Hidden file input */}
            <input
              id="profile-image-upload"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageChange}
            />
          </div>

          <div>
            <h2 className="text-2xl font-semibold dark:text-white">{name}</h2>
            <p className="text-gray-500 dark:text-gray-400">{email}</p>
          </div>
        </div>

        {/* Form for updating profile information */}
        <div className="space-y-4">
          {/* --- NEW: Grid layout for main details --- */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Full Name
              </label>
              <input
                type="text"
                // --- MODIFIED: Controlled input ---
                value={name}
                onChange={(e) => handleChange(setName)(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
              {errors.name && (
                <p className="mt-1 text-xs text-red-500">{errors.name}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                disabled
                readOnly
                className="mt-1 block w-full px-3 py-2 
             border border-gray-300 rounded-md shadow-sm 
             bg-gray-100 text-gray-700 
             focus:outline-none focus:ring-blue-500 focus:border-blue-500 
             sm:text-sm 
             disabled:bg-gray-200 disabled:text-gray-500 disabled:border-gray-300 
             dark:bg-gray-800 dark:text-gray-200 dark:border-gray-600 
             dark:disabled:bg-gray-700 dark:disabled:text-gray-400 dark:disabled:border-gray-500"
              />
            </div>
            {/* --- NEW: Phone Number --- */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Phone Number
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => handleChange(setPhone)(e.target.value)}
                placeholder="+94 77 123 4567"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
              {errors.phone && (
                <p className="mt-1 text-xs text-red-500">{errors.phone}</p>
              )}
            </div>
            {/* --- NEW: Date of Birth --- */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Date of Birth
              </label>
              <input
                type="date"
                value={dob}
                onChange={(e) => handleChange(setDob)(e.target.value)}
                className="dark:[&::-webkit-calendar-picker-indicator]:invert mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
              {errors.dob && (
                <p className="mt-1 text-xs text-red-500">{errors.dob}</p>
              )}
            </div>
          </div>

          {/* --- NEW: Address Section --- */}
          <fieldset className="border border-gray-300 dark:border-gray-600 rounded-lg p-4">
            <legend className="text-sm font-medium text-gray-700 dark:text-gray-300 px-2">
              Address
            </legend>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Street
                </label>
                <input
                  type="text"
                  name="street"
                  value={address.street}
                  onChange={handleAddressChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
                {errors.street && (
                  <p className="mt-1 text-xs text-red-500">{errors.street}</p>
                )}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    City
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={address.city}
                    onChange={handleAddressChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                  {errors.city && (
                    <p className="mt-1 text-xs text-red-500">{errors.city}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    State / Province
                  </label>
                  <input
                    type="text"
                    name="state"
                    value={address.state}
                    onChange={handleAddressChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                  {errors.state && (
                    <p className="mt-1 text-xs text-red-500">{errors.state}</p>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    ZIP / Postal Code
                  </label>
                  <input
                    type="text"
                    name="zipCode"
                    value={address.zipCode}
                    onChange={handleAddressChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                  {errors.zipCode && (
                    <p className="mt-1 text-xs text-red-500">
                      {errors.zipCode}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Country
                  </label>
                  <input
                    type="text"
                    name="country"
                    value={address.country}
                    onChange={handleAddressChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                  {errors.country && (
                    <p className="mt-1 text-xs text-red-500">
                      {errors.country}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </fieldset>

          {/* Form submission button */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={!isChanged}
              className={`w-full font-semibold py-2.5 px-4 rounded-lg transition-all duration-300 transform hover:scale-102 ${
                isChanged
                  ? "bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600"
                  : "bg-gray-400 text-gray-200 cursor-not-allowed dark:bg-gray-600"
              }`}
            >
              {isLoading ? (
                <Loader size={10} color="#4f46e5" />
              ) : (
                "Update Profile"
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
