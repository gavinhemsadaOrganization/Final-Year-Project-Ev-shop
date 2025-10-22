import Order, { IOrder } from "../../entities/Order";
import { UpdateOrderDTO, CreateOrderDTO } from "../../dtos/order.DTO";
import { Types } from "mongoose";
import { withErrorHandling } from "../../shared/utils/CustomException";

/**
 * Represents a populated Order document, where referenced ObjectIds
 * for `user_id` and `seller_id` have been replaced with actual document data.
 */
interface IOderPopulate extends Omit<IOrder, "user_id" | "seller_id"> {
  user_id: {
    name: string;
    email: string;
    phone: string;
    address: {
      street: string;
      city: string;
      state: string;
      zipCode: string;
      country: string;
    };
  } |  Types.ObjectId;
  seller_id: {
    business_name: string;
  } |  Types.ObjectId;
}

/**
 * Defines the contract for the order repository, specifying the methods for data access operations related to orders.
 */
export interface IOrderRepository {
  /**
   * Creates a new order.
   * @param data - The DTO containing the details for the new order.
   * @returns A promise that resolves to the created order document or null.
   */
  create(data: Partial<CreateOrderDTO>): Promise<IOrder | null>;
  /**
   * Finds an order by its unique ID, populating user and seller details.
   * @param id - The ID of the order to find.
   * @returns A promise that resolves to the populated order document or null if not found.
   */
  findById(id: string): Promise<IOderPopulate | null>;
  /**
   * Finds all orders placed by a specific user.
   * @param userId - The ID of the user.
   * @returns A promise that resolves to an array of order documents or null.
   */
  findByUserId(userId: string): Promise<IOrder[] | null>;
  /**
   * Finds all orders associated with a specific seller.
   * @param sellerId - The ID of the seller.
   * @returns A promise that resolves to an array of order documents or null.
   */
  findBySellerId(sellerId: string): Promise<IOrder[] | null>;
  /**
   * Retrieves all orders from the database.
   * @returns A promise that resolves to an array of all order documents or null.
   */
  findAll(): Promise<IOrder[] | null>;
  /**
   * Updates an existing order.
   * @param id - The ID of the order to update.
   * @param data - The partial DTO containing the fields to update (e.g., status).
   * @returns A promise that resolves to the updated order document or null.
   */
  update(id: string, data: Partial<UpdateOrderDTO>): Promise<IOrder | null>;
  /**
   * Deletes an order by its unique ID.
   * @param id - The ID of the order to delete.
   * @returns A promise that resolves to true if deletion was successful, otherwise false.
   */
  delete(id: string): Promise<boolean | null>;
}

/**
 * The concrete implementation of the IOrderRepository interface.
 * Each method is wrapped with a higher-order function `withErrorHandling` to ensure
 * consistent error management across the repository.
 */
export const OrderRepository: IOrderRepository = {
  /** Creates a new Order document. */
  create: withErrorHandling(async (data) => {
    const order = new Order(data);
    return await order.save();
  }),

  /** Finds a single order by its document ID and populates related user and seller information. */
  findById: withErrorHandling(async (id) => {
    return await Order.findById(id)
      .populate("user_id", "name email phone address")
      .populate("seller_id", "business_name");
  }),

  /** Finds all orders for a specific user, populating listing and seller details, sorted by most recent. */
  findByUserId: withErrorHandling(async (userId) => {
    return await Order.find({ user_id: new Types.ObjectId(userId) })
      .populate("listing_id")
      .populate("seller_id", "business_name")
      .sort({ order_date: -1 });
  }),

  /** Finds all orders for a specific seller, populating user and listing details, sorted by most recent. */
  findBySellerId: withErrorHandling(async (sellerId) => {
    return await Order.find({ seller_id: new Types.ObjectId(sellerId) })
      .populate("user_id", "name email")
      .populate("listing_id")
      .sort({ order_date: -1 });
  }),

  /** Retrieves all orders, sorted by most recent. */
  findAll: withErrorHandling(async () => {
    return await Order.find().sort({ order_date: -1 });
  }),

  /** Finds an order by ID and updates it with new data. */
  update: withErrorHandling(async (id, data) => {
    return await Order.findByIdAndUpdate(id, data, { new: true });
  }),

  /** Deletes an order by its document ID. */
  delete: withErrorHandling(async (id) => {
    const result = await Order.findByIdAndDelete(id);
    return result !== null;
  }),
};
