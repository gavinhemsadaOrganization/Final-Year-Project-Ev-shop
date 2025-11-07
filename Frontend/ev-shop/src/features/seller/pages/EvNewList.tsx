import { useEffect, useState, type ChangeEvent } from "react";
import type { Brand, categorie, EvListingFormData } from "@/types";
import { sellerService } from "../sellerService";
import { EvCheckIcon } from "@/assets/icons/icons";
import { FormSelectField } from "@/components/FormSelect";
import { FormInputField } from "@/components/FormInput";
import { StepContainer } from "@/components/StepContainer";
import { useAuth } from "@/context/AuthContext";
import { ListingType, VehicleCondition } from "@/types/enum";
// --- Types ---

// --- Component ---
export default function EvListingStepper() {
  const { getActiveRoleId } = useAuth();
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [evBrands, setEvBrands] = useState<Brand[]>([]);
  const [evCatogorys, setEvCatogorys] = useState<categorie[]>([]);
  const [formData, setFormData] = useState<EvListingFormData>({
    brand_id: "",
    category_id: "",
    model_name: "",
    year: "",
    battery_capacity_kwh: "",
    range_km: "",
    charging_time_hours: "",
    motor_type: "",
    seating_capacity: "",
    price_range: "",
    specifications: [],
    features: [],
    listing_type: "",
    condition: "",
    price: "",
    battery_health: "",
    color: "",
    registration_year: "",
    number_of_ev: "",
    images: [],
  });

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
    const fetchModels = async () => {
      try {
        const result = await sellerService.getAllEvCateogry();
        const formatted = result.map((catogory: any) => ({
          id: catogory._id,
          name: catogory.category_name,
        }));
        setEvCatogorys(formatted);
        console.log("Models:", result);
      } catch (error) {
        console.error("Error fetching models:", error);
      }
    };
    fetchModels();
    fetchBrands();
  }, []);

  const steps = [
    { id: 1, name: "Vehicle" },
    { id: 2, name: "Model Details" },
    { id: 3, name: "Listing" },
    { id: 4, name: "Photos" },
    { id: 5, name: "Review & Submit" },
  ];

  // --- Handlers ---
  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
  //   if (e.target.files) {
  //     const fileArray = Array.from(e.target.files).map((file) => file.name);
  //     setFormData((prev) => ({ ...prev, images: fileArray }));
  //   }
  // };

  // const nextStep = () => {
  //   if (currentStep < steps.length) setCurrentStep(currentStep + 1);
  // };
  const nextStep = (e?: React.MouseEvent<HTMLButtonElement>) => {
    if (e) e.preventDefault();
    if (currentStep < steps.length) {
      setCurrentStep((prev) => prev + 1);
    }
  };
  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const modeldata = {
        brand_id: formData.brand_id,
        category_id: formData.category_id,
        model_name: formData.model_name,
        year: formData.year,
        battery_capacity_kwh: formData.battery_capacity_kwh,
        range_km: formData.range_km,
        charging_time_hours: formData.charging_time_hours,
        motor_type: formData.motor_type,
        seating_capacity: formData.seating_capacity,
        price_range: formData.price_range,
        specifications: formData.specifications,
        features: formData.features,
      };
      const modelResult = await sellerService.createnewModel(modeldata);
      console.log(modelResult);

      const modelid = modelResult._id;
      const sellerid = getActiveRoleId();

      const listingdata = new FormData();
      listingdata.append("seller_id", sellerid!);
      listingdata.append("model_id", modelid);
      listingdata.append("listing_type", formData.listing_type);
      listingdata.append("condition", formData.condition);
      listingdata.append("price", formData.price.toString());
      listingdata.append("battery_health", formData.battery_health.toString());
      listingdata.append("color", formData.color);
      listingdata.append("registration_year", formData.registration_year);
      listingdata.append("number_of_ev", formData.number_of_ev.toString());

      formData.images.forEach((file) => {
        listingdata.append("images", file); // key name should match backend
      });

      const listingResult = await sellerService.createListing(listingdata);
      console.log(listingResult);
      alert("Form submitted successfully!");
      setFormData({
        brand_id: "",
        category_id: "",
        model_name: "",
        year: "",
        battery_capacity_kwh: "",
        range_km: "",
        charging_time_hours: "",
        motor_type: "",
        seating_capacity: "",
        price_range: "",
        specifications: [],
        features: [],
        listing_type: "",
        condition: "",
        price: "",
        battery_health: "",
        color: "",
        registration_year: "",
        number_of_ev: "",
        images: [],
      });
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  // --- Render Steps ---
  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <StepContainer title="Step 1: Identify Your Vehicle">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
              <FormSelectField
                label="Brand"
                name="brand_id"
                value={formData.brand_id}
                onChange={handleChange}
                options={[{ id: "", name: "Select a brand" }, ...evBrands]}
              />

              <FormSelectField
                label="Category"
                name="category_id"
                value={formData.category_id}
                onChange={handleChange}
                disabled={!formData.brand_id}
                options={
                  formData.brand_id
                    ? [{ id: "", name: "Select a category" }, ...evCatogorys]
                    : [{ id: "", name: "Select a brand first" }]
                }
              />
            </div>
          </StepContainer>
        );
      case 2:
        return (
          <StepContainer title="Step 2: Specify Vehicle Model Details">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-6">
              {/* Model Name */}
              <FormInputField
                label="Model Name"
                name="model_name"
                type="text"
                placeholder="e.g., Tesla Model 3"
                value={formData.model_name}
                onChange={handleChange}
              />

              {/* Year */}
              <FormInputField
                label="Year"
                name="year"
                type="number"
                placeholder="e.g., 2024"
                value={formData.year}
                onChange={handleChange}
              />

              {/* Battery Capacity */}
              <FormInputField
                label="Battery Capacity (kWh)"
                name="battery_capacity_kwh"
                type="number"
                placeholder="e.g., 75"
                value={formData.battery_capacity_kwh}
                onChange={handleChange}
              />

              {/* Range */}
              <FormInputField
                label="Range (km)"
                name="range_km"
                type="number"
                placeholder="e.g., 400"
                value={formData.range_km}
                onChange={handleChange}
              />

              {/* Charging Time */}
              <FormInputField
                label="Charging Time (hours)"
                name="charging_time_hours"
                type="number"
                placeholder="e.g., 8"
                value={formData.charging_time_hours}
                onChange={handleChange}
              />

              {/* Motor Type */}
              <FormInputField
                label="Motor Type"
                name="motor_type"
                type="text"
                placeholder="e.g., Dual Motor"
                value={formData.motor_type}
                onChange={handleChange}
              />

              {/* Seating Capacity */}
              <FormInputField
                label="Seating Capacity"
                name="seating_capacity"
                type="number"
                placeholder="e.g., 5"
                value={formData.seating_capacity}
                onChange={handleChange}
              />

              {/* Price Range */}
              <FormInputField
                label="Price Range"
                name="price_range"
                type="text"
                placeholder="e.g., $40,000 - $60,000"
                value={formData.price_range}
                onChange={handleChange}
              />

              {/* Condition */}
              <FormInputField
                label="specifications"
                name="specifications"
                type="text"
                placeholder="e.g., Air Conditioning, Power Steering"
                value={formData.specifications.join(", ")}
                onChange={(e) => {
                  const value = e.target.value.split(",").map((v) => v.trim());
                  setFormData({ ...formData, specifications: value });
                }}
              />

              {/* Registration Year */}
              <FormInputField
                label="Features"
                name="features"
                type="text"
                placeholder="e.g., Air Conditioning, Power Steering, ABS"
                value={formData.features.join(", ")} // join array into a readable string
                onChange={(e) => {
                  const value = e.target.value.split(",").map((v) => v.trim()); // split into array
                  setFormData({ ...formData, features: value });
                }}
              />
            </div>
          </StepContainer>
        );
      case 3:
        return (
          <StepContainer title="Step 3: Set Listing & Price">
            {/* Listing Type */}
            <FormSelectField
              label="Listing Type"
              name="listing_type"
              value={formData.listing_type}
              onChange={handleChange}
              options={[
                { id: "", name: "Select Listing Type" }, 
                ...Object.values(ListingType).map((status) => ({
                id: status,
                name: status.charAt(0).toUpperCase() + status.slice(1),
              }))
            ]}
            />

            {/* Condition */}
            <FormSelectField
              label="Condition"
              name="condition"
              value={formData.condition}
              onChange={handleChange}
              options={[
                { id: "", name: "Select Condition" }, 
                ...Object.values(VehicleCondition).map((condition) => ({
                id: condition,
                name: condition.charAt(0).toUpperCase() + condition.slice(1),
              }))
            ]}
            />

            {/* Price */}
            <FormInputField
              label="Price ($)"
              name="price"
              type="number"
              min="0"
              placeholder="e.g., 35000"
              value={formData.price === 0 ? "" : formData.price}
              onChange={handleChange}
            />

            {/* Battery Health */}
            <FormInputField
              label="Battery Health (%)"
              name="battery_health"
              type="number"
              min="0"
              max="100"
              placeholder="e.g., 90"
              value={
                formData.battery_health === 0 ? "" : formData.battery_health
              }
              onChange={handleChange}
            />

            {/* Color */}
            <FormInputField
              label="Color"
              name="color"
              type="text"
              placeholder="e.g., Pearl White"
              value={formData.color}
              onChange={handleChange}
            />

            {/* Registration Year */}
            <FormInputField
              label="Registration Year"
              name="registration_year"
              type="number"
              placeholder="e.g., 2022"
              value={formData.registration_year}
              onChange={handleChange}
            />

            {/* Number of EVs */}
            <FormInputField
              label="Number of Units"
              name="number_of_ev"
              type="number"
              min="1"
              placeholder="e.g., 2"
              value={formData.number_of_ev === 0 ? "" : formData.number_of_ev}
              onChange={handleChange}
            />
          </StepContainer>
        );
      case 4:
        return (
          <StepContainer title="Step 4: Add Photos">
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Upload Images (max 5)
              </label>

              <input
                type="file"
                multiple
                accept="image/*"
                onChange={(e) => {
                  const files = Array.from(e.target.files || []);
                  if (files.length + formData.images.length > 5) {
                    alert("You can upload a maximum of 5 images.");
                    return;
                  }

                  setFormData((prev) => ({
                    ...prev,
                    images: [...prev.images, ...files],
                  }));
                }}
                className="block w-full text-sm text-gray-500
        file:mr-4 file:py-2 file:px-4
        file:rounded-full file:border-0
        file:text-sm file:font-semibold
        file:bg-blue-50 file:text-blue-700
        hover:file:bg-blue-100"
              />

              {/* ✅ Preview Section */}
              {formData.images.length > 0 && (
                <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                  {formData.images.map((file, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={URL.createObjectURL(file)} // for preview only
                        alt={`Uploaded ${index + 1}`}
                        className="w-full h-24 object-cover rounded-lg shadow-sm border border-gray-200"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setFormData((prev) => ({
                            ...prev,
                            images: prev.images.filter((_, i) => i !== index),
                          }))
                        }
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full text-xs p-1 opacity-0 group-hover:opacity-100 transition"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </StepContainer>
        );
      case 5:
        return (
          <StepContainer title="Step 5: Review Your Listing">
            <div className="space-y-6 mt-4">
              {/* Vehicle Information */}
              <div>
                <h4 className="font-semibold text-gray-800 mb-2">
                  Vehicle Information
                </h4>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>
                    <strong>Brand:</strong>{" "}
                    {evBrands.find((b) => b.id === formData.brand_id)?.name ||
                      "—"}
                  </li>
                  <li>
                    <strong>Category:</strong>{" "}
                    {evCatogorys.find((c) => c.id === formData.category_id)
                      ?.name || "—"}
                  </li>
                  <li>
                    <strong>Model Name:</strong> {formData.model_name || "—"}
                  </li>
                  <li>
                    <strong>Year:</strong> {formData.year || "—"}
                  </li>
                </ul>
              </div>

              {/* Performance */}
              <div>
                <h4 className="font-semibold text-gray-800 mb-2">
                  Performance
                </h4>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>
                    <strong>Battery Capacity:</strong>{" "}
                    {formData.battery_capacity_kwh || "—"} kWh
                  </li>
                  <li>
                    <strong>Range:</strong> {formData.range_km || "—"} km
                  </li>
                  <li>
                    <strong>Charging Time:</strong>{" "}
                    {formData.charging_time_hours || "—"} hrs
                  </li>
                  <li>
                    <strong>Motor Type:</strong> {formData.motor_type || "—"}
                  </li>
                  <li>
                    <strong>Seating Capacity:</strong>{" "}
                    {formData.seating_capacity || "—"}
                  </li>
                </ul>
              </div>

              {/* Listing Details */}
              <div>
                <h4 className="font-semibold text-gray-800 mb-2">
                  Listing Details
                </h4>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>
                    <strong>Listing Type:</strong>{" "}
                    {formData.listing_type || "—"}
                  </li>
                  <li>
                    <strong>Condition:</strong> {formData.condition || "—"}
                  </li>
                  <li>
                    <strong>Price:</strong>{" "}
                    {formData.price ? `$${formData.price}` : "—"}
                  </li>
                  <li>
                    <strong>Battery Health:</strong>{" "}
                    {formData.battery_health
                      ? `${formData.battery_health}%`
                      : "—"}
                  </li>
                  <li>
                    <strong>Color:</strong> {formData.color || "—"}
                  </li>
                  <li>
                    <strong>Registration Year:</strong>{" "}
                    {formData.registration_year || "—"}
                  </li>
                  <li>
                    <strong>Number of Units:</strong>{" "}
                    {formData.number_of_ev || "—"}
                  </li>
                </ul>
              </div>

              {/* Images Preview */}
              <div>
                <h4 className="font-semibold text-gray-800 mb-2">
                  Uploaded Images
                </h4>
                {formData.images && formData.images.length > 0 ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                    {formData.images.map((img, index) => (
                      <img
                        key={index}
                        src={URL.createObjectURL(img)}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-24 object-cover rounded-lg border border-gray-300 shadow-sm"
                      />
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">No images uploaded.</p>
                )}
              </div>
            </div>
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
                    <EvCheckIcon />
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
                onClick={(e) => nextStep(e)}
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
