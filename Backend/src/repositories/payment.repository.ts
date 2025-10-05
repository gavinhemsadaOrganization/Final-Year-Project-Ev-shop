import { Payment, IPayment } from "../models/Payment";
import { CreatePaymentDTO } from "../dtos/payment.DTO";
import { withErrorHandling } from "../utils/CustomException";

export interface IPaymentRepository {
  create(data: object): Promise<IPayment | null>;
  findById(id: string): Promise<IPayment | null>;
  findByOrderId(orderId: string): Promise<IPayment | null>;
  findAll(query: any): Promise<IPayment[] | null>;
  update(id: string, data: CreatePaymentDTO): Promise<IPayment | null>;
  delete(id: string): Promise<boolean | null>;
}

export const PaymentRepository: IPaymentRepository = {
  create: withErrorHandling(async (data) => {
    const payment = new Payment(data);
    return await payment.save();
  }),

  findById: withErrorHandling(async (id) => {
    return await Payment.findById(id);
  }),

  findByOrderId: withErrorHandling(async (orderId) => {
    return await Payment.findOne({ order_id: orderId });
  }),

  findAll: withErrorHandling(async (query) => {
    return await Payment.find(query).sort({ createdAt: -1 });
  }),

  update: withErrorHandling(async (id, data) => {
    return await Payment.findByIdAndUpdate(id, data, { new: true });
  }),

  delete: withErrorHandling(async (id) => {
    try {
      const result = await Payment.findByIdAndDelete(id);
      return result !== null;
    } catch (error) {
      console.error("Error deleting payment:", error);
      return false;
    }
  }),
};









