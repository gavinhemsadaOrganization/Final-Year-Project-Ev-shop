import { CreateOrderDTO, UpdateOrderDTO } from "../dtos/order.DTO";
import { OrderStatus, PaymentStatus } from "../enum/enum";
import { IOrder } from "../models/Order";
import { IOrderRepository } from "../repositories/order.repository";

export interface IOrderService {
  createOrder(
    data: CreateOrderDTO
  ): Promise<{ success: boolean; order?: any; error?: string }>;
  getOrderById(
    id: string
  ): Promise<{ success: boolean; order?: any; error?: string }>;
  getOrdersByUserId(
    userId: string
  ): Promise<{ success: boolean; orders?: any[]; error?: string }>;
  getOrdersBySellerId(
    sellerId: string
  ): Promise<{ success: boolean; orders?: any[]; error?: string }>;
  updateOrder(
    id: string,
    data: UpdateOrderDTO
  ): Promise<{ success: boolean; order?: any; error?: string }>;
  cancelOrder(id: string): Promise<{ success: boolean; error?: string }>;
}

export function orderService(repo: IOrderRepository): IOrderService {
  return {
    createOrder: async (data) => {
      try {
        const orderData = {
          ...data,
          order_date: new Date(),
          order_status: OrderStatus.PENDING,
          payment_status: PaymentStatus.CONFIRMED,
        };
        const order = await repo.create(orderData);
        return { success: true, order };
      } catch (err) {
        return { success: false, error: "Failed to create order" };
      }
    },

    getOrderById: async (id) => {
      const order = await repo.findById(id);
      if (!order) return { success: false, error: "Order not found" };
      return { success: true, order };
    },

    getOrdersByUserId: async (userId) => {
      const orders = await repo.findByUserId(userId);
      if (!orders) return { success: false, error: "No orders found" };
      return { success: true, orders };
    },

    getOrdersBySellerId: async (sellerId) => {
      const orders = await repo.findBySellerId(sellerId);
      if(!orders) return { success: false, error: "No orders found" };
      return { success: true, orders };
    },

    updateOrder: async (id, data) => {
      const order = await repo.update(id, data);
      if (!order) return { success: false, error: "Order not found" };
      return { success: true, order };
    },

    cancelOrder: async (id) => {
      const order = await repo.update(id, {
        order_status: OrderStatus.CANCELLED,
      });
      if (!order) return { success: false, error: "Order not found" };
      return { success: true };
    },
  };
}
