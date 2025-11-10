export const queryKeys = {
    // buyer
  userProfile: (id:string) => ["userProfile", id],
  notifications: (userID: string) => ["notification", userID],
  cart: (id: string) => ["cart", id],
  orders: (id: string) => ["orders", id],
  evlist: ["evlist"],
  testDrive: (id: string) => ["testDrive", id],
  communityPosts: ["communityPosts"],
  communityPost: (id: string) => ["communityPost", id],
  // seller
  // finac
};
