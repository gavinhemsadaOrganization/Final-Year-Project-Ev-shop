import Order, { IOrder } from "../models/Order";
import { UpdateOrderDTO, CreateOrderDTO } from "../dtos/order.DTO";
import { Types } from "mongoose";

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

export interface IOrderRepository {
  create(data: Partial<CreateOrderDTO>): Promise<IOrder>;
  findById(id: string): Promise<IOderPopulate | null>;
  findByUserId(userId: string): Promise<IOrder[]>;
  findBySellerId(sellerId: string): Promise<IOrder[]>;
  findAll(): Promise<IOrder[]>;
  update(id: string, data: Partial<UpdateOrderDTO>): Promise<IOrder | null>;
  delete(id: string): Promise<boolean>;
}

export const OrderRepository: IOrderRepository = {
  create: async (data) => {
    const order = new Order(data);
    return await order.save();
  },

  findById: async (id) => {
    return await Order.findById(id)
      .populate("user_id", "name email phone address")
      .populate("seller_id", "business_name");
  },

  findByUserId: async (userId) => {
    return await Order.find({ user_id: new Types.ObjectId(userId) })
      .populate("listing_id")
      .populate("seller_id", "business_name")
      .sort({ order_date: -1 });
  },

  findBySellerId: async (sellerId) => {
    return await Order.find({ seller_id: new Types.ObjectId(sellerId) })
      .populate("user_id", "name email")
      .populate("listing_id")
      .sort({ order_date: -1 });
  },

  findAll: async () => {
    return await Order.find().sort({ order_date: -1 });
  },

  update: async (id, data) => {
    return await Order.findByIdAndUpdate(id, data, { new: true });
  },

  delete: async (id) => {
    const result = await Order.findByIdAndDelete(id);
    return result !== null;
  },
};
