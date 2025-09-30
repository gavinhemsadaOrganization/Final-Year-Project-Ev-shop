import { Payment, IPayment } from "../models/Payment";
import { CreatePaymentDTO, UpdatePaymentDTO } from "../dtos/payment.DTO";
import { PaymentStatus } from "../enum/enum";

export interface IPaymentRepository {
  create(data: CreatePaymentDTO): Promise<IPayment>;
  findById(id: string): Promise<IPayment | null>;
  findByOrderId(orderId: string): Promise<IPayment | null>;
  findAll(query: any): Promise<IPayment[]>;
  update(id: string, data: UpdatePaymentDTO): Promise<IPayment | null>;
  delete(id: string): Promise<boolean>;
}

export const PaymentRepository: IPaymentRepository = {
  create: async (data) => {
    const payment = new Payment({ ...data, status: PaymentStatus.CONFIRMED });
    return await payment.save();
  },

  findById: async (id) => {
    return await Payment.findById(id);
  },

  findByOrderId: async (orderId) => {
    return await Payment.findOne({ order_id: orderId });
  },

  findAll: async (query) => {
    return await Payment.find(query).sort({ createdAt: -1 });
  },

  update: async (id, data) => {
    return await Payment.findByIdAndUpdate(id, data, { new: true });
  },

  delete: async (id) => {
    try {
      const result = await Payment.findByIdAndDelete(id);
      return result !== null;
    } catch (error) {
      console.error("Error deleting payment:", error);
      return false;
    }
  },
};









