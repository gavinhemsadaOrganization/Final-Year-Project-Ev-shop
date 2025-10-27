import { BellIcon } from "@/assets/icons/icons"; 
import type { Notification } from "@/types";

const notifications: Notification[] = [
  {
    id: 1,
    message: "Your test drive for Aura EV is confirmed for Oct 15. Your test drive for Aura EV is confirmed for Oct 15. Your test drive for Aura EV is confirmed for Oct 15.",
    time: "2 hours ago",
  },
  {
    id: 2,
    message: "New accessory added: All-weather floor mats.",
    time: "1 day ago",
  },
  {
    id: 3,
    message: "Your order ORD-2025-007 has been delivered.",
    time: "3 days ago",
  },
  {
    id: 4,
    message:
      "A software update is available for your Pulse XR. Schedule an appointment?",
    time: "5 days ago",
  },
];
// --- End Mock Data ---

export const NotificationPage: React.FC = () => {
  return (
    <div className="bg-white p-8 rounded-xl shadow-md">
      <div className="flex items-center gap-4 mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Notifications</h1>
      </div>
      
      <div className="grid grid-cols-1 gap-6">
        <div className="flex flex-col">
          {notifications.map((notif, index) => (
            <div
              key={notif.id}
              className={`flex items-start gap-4 p-5 ${
                index !== notifications.length - 1 ? "border-b" : ""
              } border-gray-200`}
            >
              <div className="mt-1 flex-shrink-0 p-2 bg-blue-100 rounded-full">
                <BellIcon className="h-5 w-5 text-blue-600" />
              </div>
              <div className="flex-1">
                <p className="text-gray-800">{notif.message}</p>
                <p className="text-sm text-gray-500 mt-1">{notif.time}</p>
                
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};