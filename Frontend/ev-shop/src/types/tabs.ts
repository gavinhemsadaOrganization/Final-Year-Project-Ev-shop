export const BuyerActiveTabes = {
  Dashboard : "dashboard",
  Orders : "orders",
  Profile : "profile",
  Saved : "saved",
  Services : "services",
  Notification : "notification",
  Cart : "cart",
  TestDrives : "testDrives",
  Reviews : "reviews",
  Financing : "financing",
  Community : "community",
}as const;
export type BuyerActiveTabes = (typeof BuyerActiveTabes)[keyof typeof BuyerActiveTabes];

export type ActiveTab =
  | "dashboard"
  | "orders"
  | "profile"
  | "saved"
  | "services"
  | "notification"
  | "cart"
  | "testDrives"
  | "reviews"
  | "financing"
  | "community";

  export type SellerActiveTab =
  | "dashboard"
  | "orders"
  | "profile"
  | "evList"
  | "saved"
  | "reviews"
  | "community"
  | "test-drives"
  | "notification";
