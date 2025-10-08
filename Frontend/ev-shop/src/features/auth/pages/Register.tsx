import GoogleIcon from "@/assets/icons/google-icon.svg";
import FacebookIcon from "@/assets/icons/facebook-icon.svg";

import Label from "../components/Label";
import Input from "../components/inputFiled";

const RegisterPage = () => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Add your form validation and submission logic here
    console.log("Registration form submitted");
  };

  const handleOAuth = (provider: string) => {
    console.log(`Registering with ${provider}`);
  };

  return (
    <div className="flex items-stretch min-h-screen w-screen bg-gray-100 md:bg-black font-sans">
      {/* Left Panel: Image */}
      <div 
        className="hidden md:block md:w-1/2 bg-cover bg-center" 
        style={{ backgroundImage: "url('https://placehold.co/1200x1200/000000/FFF?text=Your+Image')" }}
      ></div>

      {/* Right Panel: Register Form */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-4">
        <div className="w-full max-w-md p-6 md:p-8 space-y-6 bg-white rounded-xl shadow-lg">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900">Create an Account</h1>
            <p className="mt-2 text-sm text-gray-600">
              Get started with your free account today.
            </p>
          </div>

          {/* OAuth Buttons */}
          <div className="space-y-4">
            <button
              onClick={() => handleOAuth('Google')}
              className="w-full flex items-center justify-center gap-3 py-3 px-4 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all"
            >
              <GoogleIcon />
              Sign up with Google
            </button>
            <button
              onClick={() => handleOAuth('Facebook')}
              className="w-full flex items-center justify-center gap-3 py-3 px-4 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all"
            >
              <FacebookIcon />
              Sign up with Facebook
            </button>
          </div>

          {/* Divider */}
          <div className="flex items-center">
            <div className="flex-grow border-t border-gray-300"></div>
            <span className="mx-4 text-sm font-medium text-gray-400">OR</span>
            <div className="flex-grow border-t border-gray-300"></div>
          </div>

          {/* Register Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="email">Email address</Label>
              <Input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                placeholder="you@example.com"
              />
            </div>

            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                placeholder="••••••••"
              />
            </div>
            
            <div>
              <Label htmlFor="confirm-password">Confirm Password</Label>
              <Input
                id="confirm-password"
                name="confirm-password"
                type="password"
                autoComplete="new-password"
                required
                placeholder="••••••••"
              />
            </div>

            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all mt-4"
              >
                Create Account
              </button>
            </div>
          </form>

          <p className="text-sm text-center text-gray-500">
            Already have an account?{" "}
            <a href="#" className="font-medium text-indigo-600 hover:text-indigo-500">
              Sign in
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
