import React, { useState, useEffect } from "react";
import {
  CarIcon,
  CheckIcon,
  CalendarIcon,
  ClockIcon,
} from "@/assets/icons/icons"; // Assuming you have Calendar and Clock icons
import { useAuth } from "@/context/AuthContext";

// --- Mock Data (replace with API calls) ---
const mockSlots: any[] = [
  {
    _id: "slot1",
    model_id: "Aura EV",
    seller_id: "Seller A",
    available_date: new Date("2024-10-20T00:00:00.000Z"),
    start_time: "09:00",
    end_time: "17:00",
    max_bookings: 5,
    is_active: true,
  },
  {
    _id: "slot2",
    model_id: "Pulse XR",
    seller_id: "Seller B",
    available_date: new Date("2024-10-21T00:00:00.000Z"),
    start_time: "10:00",
    end_time: "16:00",
    max_bookings: 3,
    is_active: true,
  },
  {
    _id: "slot3",
    model_id: "City Spark",
    seller_id: "Seller A",
    available_date: new Date("2024-10-22T00:00:00.000Z"),
    start_time: "11:00",
    end_time: "15:00",
    max_bookings: 4,
    is_active: true,
  },
];

const mockBookings: any[] = [
  {
    _id: "booking1",
    customer_id: "user123",
    slot_id: "slot1",
    booking_date: new Date("2024-10-20T00:00:00.000Z"),
    booking_time: "10:00",
    status: "Confirmed",
    duration_minutes: 60,
    model_name: "Aura EV", // Added for display
  },
];

/**
 * A page for users to view and book test drives.
 */
export const TestDrivesPage: React.FC = () => {
  const [slots, setSlots] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { getUserID } = useAuth();

  useEffect(() => {
    // In a real app, you would fetch this data from your API
    // For example:
    // const fetchSlots = async () => {
    //   const response = await fetch('/api/test-drive/slots/active');
    //   const data = await response.json();
    //   setSlots(data.slots);
    // };
    // const fetchBookings = async () => {
    //   const userId = getUserID();
    //   const response = await fetch(`/api/test-drive/bookings/customer/${userId}`);
    //   const data = await response.json();
    //   setBookings(data.bookings);
    // };
    // Promise.all([fetchSlots(), fetchBookings()]).finally(() => setIsLoading(false));

    // Using mock data for now
    setSlots(mockSlots);
    setBookings(mockBookings);
    setIsLoading(false);
  }, [getUserID]);

  const handleBookSlot = (slotId: string) => {
    // Logic to book a slot
    // This would typically involve a POST request to `/api/test-drive/bookings`
    console.log(`Booking slot ${slotId} for user ${getUserID()}`);
    alert(`Booking request for slot ${slotId} sent!`);
    // You would then re-fetch the bookings to update the UI
  };

  if (isLoading) {
    return (
      <div className="text-center p-8">Loading test drive information...</div>
    );
  }

  return (
    <div className="space-y-12">
      {/* Section for User's Existing Bookings */}
      <div>
        <h1 className="text-3xl font-bold mb-6">My Test Drives</h1>
        <div className="bg-white p-6 rounded-xl shadow-md">
          {bookings.length > 0 ? (
            <ul className="divide-y divide-gray-200">
              {bookings.map((booking) => (
                <li
                  key={booking._id}
                  className="py-4 flex items-center justify-between"
                >
                  <div>
                    <p className="font-semibold text-lg">
                      {booking.model_name}
                    </p>
                    <p className="text-sm text-gray-600 flex items-center gap-2 mt-1">
                      <CalendarIcon className="h-4 w-4" />
                      {new Date(booking.booking_date).toLocaleDateString()}
                      <span className="text-gray-300">|</span>
                      <ClockIcon className="h-4 w-4" />
                      {booking.booking_time}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 text-green-600">
                    <CheckIcon className="h-5 w-5" />
                    <span className="font-semibold">{booking.status}</span>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500 text-center py-8">
              You have no upcoming test drives.
            </p>
          )}
        </div>
      </div>

      {/* Section for Available Slots */}
      <div>
        <h1 className="text-3xl font-bold mb-6">Available Test Drive Slots</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {slots.map((slot) => (
            <div
              key={slot._id}
              className="bg-white p-6 rounded-xl shadow-md flex flex-col justify-between hover:shadow-lg transition-shadow"
            >
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-blue-100 rounded-full">
                    <CarIcon className="h-6 w-6 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-bold">{slot.model_id}</h3>
                </div>
                <p className="text-sm text-gray-500 mb-1">
                  With{" "}
                  <span className="font-medium text-gray-700">
                    {slot.seller_id}
                  </span>
                </p>
                <div className="mt-4 space-y-2 text-sm">
                  <p className="flex items-center gap-2">
                    <CalendarIcon className="h-4 w-4 text-gray-500" />
                    <span className="font-medium">Date:</span>
                    <span>
                      {new Date(slot.available_date).toLocaleDateString()}
                    </span>
                  </p>
                  <p className="flex items-center gap-2">
                    <ClockIcon className="h-4 w-4 text-gray-500" />
                    <span className="font-medium">Time:</span>
                    <span>{`${slot.start_time} - ${slot.end_time}`}</span>
                  </p>
                </div>
              </div>
              <button
                onClick={() => handleBookSlot(slot._id)}
                disabled={bookings.some((b) => b.slot_id === slot._id)}
                className="w-full mt-6 bg-blue-600 text-white py-2.5 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {bookings.some((b) => b.slot_id === slot._id)
                  ? "Booked"
                  : "Book Now"}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TestDrivesPage;
