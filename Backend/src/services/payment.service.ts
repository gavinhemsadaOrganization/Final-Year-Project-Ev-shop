import { CreatePaymentDTO, UpdatePaymentDTO } from "../dtos/payment.DTO";
import { IPaymentRepository } from "../repositories/payment.repository";

export interface IPaymentService {
  createPayment(
    data: CreatePaymentDTO
  ): Promise<{ success: boolean; payment?: any; error?: string }>;
  getPaymentById(
    id: string
  ): Promise<{ success: boolean; payment?: any; error?: string }>;
  getPaymentByOrderId(
    orderId: string
  ): Promise<{ success: boolean; payment?: any; error?: string }>;
  getAllPayments(query: any): Promise<{ success: boolean; payments?: any[]; error?: string }>;
  updatePayment(
    id: string,
    data: UpdatePaymentDTO
  ): Promise<{ success: boolean; payment?: any; error?: string }>;
  deletePayment(id: string): Promise<{ success: boolean; error?: string }>;
}

export function paymentService(repo: IPaymentRepository): IPaymentService {
  return {
    createPayment: async (data) => {
      try {
        const payment = await repo.create(data);
        return { success: true, payment };
      } catch (err) {
        return { success: false, error: "Failed to create payment" };
      }
    },
    getPaymentById: async (id) => {
      const payment = await repo.findById(id);
      if (!payment) return { success: false, error: "Payment not found" };
      return { success: true, payment };
    },
    getPaymentByOrderId: async (orderId) => {
      const payment = await repo.findByOrderId(orderId);
      if (!payment) return { success: false, error: "Payment not found for this order" };
      return { success: true, payment };
    },
    getAllPayments: async (query) => {
      try {
        const payments = await repo.findAll(query);
        return { success: true, payments };
      } catch (err) {
        return { success: false, error: "Failed to retrieve payments" };
      }
    },
    updatePayment: async (id, data) => {
      try {
        const payment = await repo.update(id, data);
        if (!payment) return { success: false, error: "Payment not found" };
        return { success: true, payment };
      } catch (err) {
        return { success: false, error: "Failed to update payment" };
      }
    },
    deletePayment: async (id) => {
      try {
        const success = await repo.delete(id);
        if (!success) return { success: false, error: "Payment not found" };
        return { success: true };
      } catch (err) {
        return { success: false, error: "Failed to delete payment" };
      }
    },
  };
}





