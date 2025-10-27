import type { User } from "@/types";

export const UserProfile: React.FC<{user:User}> = ({user}) => (
  <div className="bg-white p-8 rounded-xl shadow-md max-w-2xl mx-auto">
    <h1 className="text-3xl font-bold mb-6">My Profile</h1>
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
    <div className="mt-8 space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Full Name
        </label>
        <input
          type="text"
          defaultValue={user.name}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        />
      </div>
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
      <div className="pt-4">
        <button className="w-full bg-blue-600 text-white font-semibold py-2.5 px-4 rounded-lg hover:bg-blue-700 transition-colors duration-300 transform hover:scale-105">
          Update Profile
        </button>
      </div>
    </div>
  </div>
);