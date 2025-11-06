import React, {
  useEffect,
  useState,
  type ChangeEvent,
  type FormEvent,
} from "react";
import type { Brand, Model } from "@/types";
import { sellerService } from "../sellerService";

interface FormData {
  // Step 1
  brand_id: string;
  model_id: string;
  year: number;

  // Step 2
  condition: "New" | "Used";
  registration_year: string;
  battery_health: string;
  color: string;

  // Step 3
  listing_type: "ForSale" | "ForRent";
  price: string;
  number_of_ev: number;

  // Step 4
  images: string[];
}

const mockModels: Record<string, Model[]> = {
  "65e8a1b1": [
    { id: "65e8a2b1", name: "Model 3" },
    { id: "65e8a2c2", name: "Model Y" },
    { id: "65e8a2d3", name: "Model S" },
  ],
  "65e8a1c2": [
    { id: "65e8a3b1", name: "Leaf" },
    { id: "65e8a3c2", name: "Ariya" },
  ],
  "65e8a1d3": [
    { id: "65e8a4b1", name: "R1S" },
    { id: "65e8a4c2", name: "R1T" },
  ],
};

// --- Component ---
export default function EvListingStepper() {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [evBrands, setEvBrands] = useState<Brand[]>([]);

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const result = await sellerService.getAllEvBrand();
        const formatted = result.map((brand: any) => ({
          id: brand._id, 
          name: brand.brand_name, 
        }));
        setEvBrands(formatted);
        console.log("Brands:", result);
      } catch (error) {
        console.error("Error fetching brands:", error);
      }
    };
    fetchBrands();
  }, []);

  const [formData, setFormData] = useState<FormData>({
    brand_id: "",
    model_id: "",
    year: 2024,
    condition: "Used",
    registration_year: "",
    battery_health: "",
    color: "",
    listing_type: "ForSale",
    price: "",
    number_of_ev: 1,
    images: [],
  });

  const steps = [
    { id: 1, name: "Vehicle" },
    { id: 2, name: "Details" },
    { id: 3, name: "Listing" },
    { id: 4, name: "Photos & Review" },
  ];

  // --- Handlers ---
  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const fileArray = Array.from(e.target.files).map((file) => file.name);
      setFormData((prev) => ({ ...prev, images: fileArray }));
    }
  };

  const nextStep = () => {
    if (currentStep < steps.length) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const finalListingDTO = {
      ...formData,
      seller_id: "LOGGED_IN_USER_ID", // placeholder
    };
    alert("Listing Submitted! Check the console for the final DTO.");
    console.log("Final DTO to send to API:", finalListingDTO);
  };

  const availableModels = mockModels[formData.brand_id] || [];

  // --- Render Steps ---
  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <StepContainer title="Step 1: Identify Your Vehicle">
            <FormSelect
              label="Brand"
              name="brand_id"
              value={formData.brand_id}
              onChange={handleChange}
              options={[{ id: "", name: "Select a brand" }, ...evBrands]}
            />
            <FormSelect
              label="Model"
              name="model_id"
              value={formData.model_id}
              onChange={handleChange}
              disabled={!formData.brand_id}
              options={[{ id: "", name: "Select a model" }, ...availableModels]}
            />
          </StepContainer>
        );
      case 2:
        return (
          <StepContainer title="Step 2: Specify Vehicle Details">
            <FormSelect
              label="Condition"
              name="condition"
              value={formData.condition}
              onChange={handleChange}
              options={[
                { id: "New", name: "New" },
                { id: "Used", name: "Used" },
              ]}
            />
            <FormInput
              label="Registration Year"
              name="registration_year"
              type="number"
              placeholder="e.g., 2021"
              value={formData.registration_year}
              onChange={handleChange}
            />
            <FormInput
              label="Battery Health (%)"
              name="battery_health"
              type="number"
              min="0"
              max="100"
              placeholder="e.g., 95"
              value={formData.battery_health}
              onChange={handleChange}
            />
            <FormInput
              label="Color"
              name="color"
              type="text"
              placeholder="e.g., Deep Blue Metallic"
              value={formData.color}
              onChange={handleChange}
            />
          </StepContainer>
        );
      case 3:
        return (
          <StepContainer title="Step 3: Set Listing & Price">
            <FormSelect
              label="Listing Type"
              name="listing_type"
              value={formData.listing_type}
              onChange={handleChange}
              options={[
                { id: "ForSale", name: "For Sale" },
                { id: "ForRent", name: "For Rent" },
              ]}
            />
            <FormInput
              label="Price ($)"
              name="price"
              type="number"
              min="0"
              placeholder="e.g., 35000"
              value={formData.price}
              onChange={handleChange}
            />
            <FormInput
              label="Number of Units"
              name="number_of_ev"
              type="number"
              min="1"
              value={formData.number_of_ev}
              onChange={handleChange}
            />
          </StepContainer>
        );
      case 4:
        return (
          <StepContainer title="Step 4: Add Photos & Review">
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Upload Images
              </label>
              <input
                type="file"
                multiple
                onChange={handleFileChange}
                className="block w-full text-sm text-gray-500
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-full file:border-0
                  file:text-sm file:font-semibold
                  file:bg-blue-50 file:text-blue-700
                  hover:file:bg-blue-100"
              />
              <div className="mt-2 text-sm text-gray-600">
                {formData.images.length > 0 ? (
                  <p>Files selected: {formData.images.join(", ")}</p>
                ) : (
                  <p>No files selected.</p>
                )}
              </div>
            </div>

            <hr className="my-6" />

            <h3 className="text-lg font-medium text-gray-900">
              Review Your Listing
            </h3>
            <pre className="mt-4 p-4 bg-gray-50 rounded-md overflow-x-auto text-sm">
              {JSON.stringify(formData, null, 2)}
            </pre>
          </StepContainer>
        );
      default:
        return null;
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4 sm:p-8 bg-white shadow-xl rounded-lg">
      {/* Stepper */}
      <div className="mb-8">
        <div className="relative">
          <div
            className="absolute left-0 top-1/2 -mt-px w-full h-0.5 bg-gray-200"
            aria-hidden="true"
          ></div>
          <div
            className="absolute left-0 top-1/2 -mt-px h-0.5 bg-blue-600 transition-all duration-300"
            style={{
              width: `${((currentStep - 1) / (steps.length - 1)) * 100}%`,
            }}
          ></div>

          <div className="relative flex justify-between">
            {steps.map((step) => (
              <div key={step.id} className="flex flex-col items-center z-10">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300
                    ${currentStep >= step.id ? "bg-blue-600" : "bg-gray-200"}
                    ${currentStep > step.id ? "text-white" : "text-gray-500"}`}
                >
                  {currentStep > step.id ? (
                    <CheckIcon />
                  ) : (
                    <span
                      className={`font-medium ${
                        currentStep >= step.id ? "text-white" : "text-gray-500"
                      }`}
                    >
                      {step.id}
                    </span>
                  )}
                </div>
                <span className="text-sm font-medium mt-2 text-gray-700">
                  {step.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Step Content */}
      <form onSubmit={handleSubmit}>
        {renderStepContent()}

        <div className="mt-8 pt-5 border-t border-gray-200">
          <div className="flex justify-between">
            <button
              type="button"
              onClick={prevStep}
              disabled={currentStep === 1}
              className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Back
            </button>

            {currentStep === steps.length ? (
              <button
                type="submit"
                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
              >
                Submit Listing
              </button>
            ) : (
              <button
                type="button"
                onClick={nextStep}
                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                Next
              </button>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}

// --- Reusable Components ---
const StepContainer: React.FC<{ title: string; children: React.ReactNode }> = ({
  title,
  children,
}) => (
  <div className="space-y-6">
    <h2 className="text-2xl font-semibold text-gray-900">{title}</h2>
    {children}
  </div>
);

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  name: string;
}
const FormInput: React.FC<FormInputProps> = ({ label, name, ...props }) => (
  <div>
    <label htmlFor={name} className="block text-sm font-medium text-gray-700">
      {label}
    </label>
    <div className="mt-1">
      <input
        id={name}
        name={name}
        {...props}
        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
      />
    </div>
  </div>
);

interface FormSelectProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  name: string;
  options: { id: string; name: string }[];
}
const FormSelect: React.FC<FormSelectProps> = ({
  label,
  name,
  options,
  ...props
}) => (
  <div>
    <label htmlFor={name} className="block text-sm font-medium text-gray-700">
      {label}
    </label>
    <select
      id={name}
      name={name}
      {...props}
      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
    >
      {options.map((option) => (
        <option key={option.id || option.name} value={option.id}>
          {option.name}
        </option>
      ))}
    </select>
  </div>
);

const CheckIcon: React.FC = () => (
  <svg
    className="w-5 h-5"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M5 13l4 4L19 7"
    />
  </svg>
);
