export type Order = {
  id: string;
  date: string;
  vehicle: string;
  status: "Delivered" | "Processing" | "Cancelled";
  total: string;
};