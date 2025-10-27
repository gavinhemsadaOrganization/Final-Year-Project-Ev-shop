import type { User } from "@/types";

/**
 * Props for the UserProfile component.
 */
type UserProfileProps = {
  /** The user object containing profile information like name, email, and avatar. */
  user: User;
};

/**
 * A page component that displays and allows editing of the user's profile information.
 * Note: This component currently uses uncontrolled inputs with `defaultValue`.
 * For a fully functional form, it should be refactored to use state (e.g., `useState`)
 * to manage form data, making them controlled components.
 */
export const UserProfile: React.FC<UserProfileProps> = ({ user }) => (
  // Main container for the profile page with styling for centering and appearance.
  <div className="bg-white p-8 rounded-xl shadow-md max-w-2xl mx-auto">
    <h1 className="text-3xl font-bold mb-6">My Profile</h1>
    {/* Profile header section displaying avatar, name, and email. */}
    <div className="flex items-center space-x-6">
      <img
        src={user.avatar}
        alt="User Avatar"
        className="h-24 w-24 rounded-full object-cover"
      />
      <div>
        <h2 className="text-2xl font-semibold">{user.name}</h2>
        <p className="text-gray-500">{user.email}</p>
      </div>
    </div>
    {/* Form for updating user profile information. */}
    <div className="mt-8 space-y-4">
      {/* Full Name input field. */}
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Full Name
        </label>
        <input
          type="text"
          // `defaultValue` sets the initial value but doesn't update with state changes (uncontrolled).
          defaultValue={user.name}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        />
      </div>
      {/* Email Address input field. */}
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Email Address
        </label>
        <input
          type="email"
          defaultValue={user.email}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        />
      </div>
      {/* Change Password input field. */}
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Change Password
        </label>
        <input
          type="password"
          placeholder="New Password"
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        />
      </div>
      {/* Form submission button. */}
      <div className="pt-4">
        <button className="w-full bg-blue-600 text-white font-semibold py-2.5 px-4 rounded-lg hover:bg-blue-700 transition-colors duration-300 transform hover:scale-105">
          Update Profile
        </button>
      </div>
    </div>
  </div>
);
