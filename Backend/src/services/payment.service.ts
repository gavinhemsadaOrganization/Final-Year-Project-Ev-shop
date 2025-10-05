import { CreatePaymentDTO } from "../dtos/payment.DTO";
import { IPaymentRepository } from "../repositories/payment.repository";
import { IOrderRepository } from "../repositories/order.repository";
import { PaymentStatus } from "../enum/enum";
import { createPaymentRequest, singelLineAddress, verifyNotificationHash } from "../utils/Payhere";

export interface IPaymentService {
  createPayment(
    data: CreatePaymentDTO
  ): Promise<{ success: boolean; payment?: any; error?: string }>;
  validatePayment(
    data: any
  ): Promise<{ success: boolean; payment?: any; error?: string }>;
  getPaymentById(
    id: string
  ): Promise<{ success: boolean; payment?: any; error?: string }>;
  getPaymentByOrderId(
    orderId: string
  ): Promise<{ success: boolean; payment?: any; error?: string }>;
  checkPaymentStatus(id: string) : Promise<{ success: boolean; payment?: any; error?: string }>;
  getAllPayments(
    query: any
  ): Promise<{ success: boolean; payments?: any[]; error?: string }>;
  updatePayment(
    id: string,
    data: CreatePaymentDTO
  ): Promise<{ success: boolean; payment?: any; error?: string }>;
  deletePayment(id: string): Promise<{ success: boolean; error?: string }>;
}

export function paymentService(
  repo: IPaymentRepository,
  orderRepo: IOrderRepository
): IPaymentService {
  const notifyurl = process.env.PAYHERE_NOTIFY!;
  return {
    createPayment: async (data) => {
      try {
        const order = await orderRepo.findById(data.order_id);
        if (!order) return { success: false, error: "Order not found" };
        const { returnUrl, cancelUrl, ...otherData } = data;
        const paymentData = {
          ...otherData,
          status: PaymentStatus.CONFIRMED,
        };
        let requestObject;
        if ("name" in order.user_id) {
          requestObject = createPaymentRequest({
            orderId: paymentData.order_id,
            amount: paymentData.amount,
            currency: "LKR",
            description: paymentData.payment_type,
            customerInfo: {
              firstName: order.user_id.name.split(" ")[0],
              lastName: order.user_id.name.split(" ")[1],
              email: order.user_id.email,
              phone: order.user_id.phone,
              address: singelLineAddress(order.user_id.address),
              city: order.user_id.address.city,
              country: order.user_id.address.country,
            },
            returnUrl: data.returnUrl,
            cancelUrl: data.cancelUrl,
            notifyUrl: notifyurl,
          });
        }
        if(!requestObject) return { success: false, error: "Failed to create payment" };
        const payment = await repo.create(paymentData);
        if (!payment)
          return { success: false, error: "Failed to create new  payment" };
        return { success: true, requestObject};
      } catch (err) {
        console.log(err);
        return { success: false, error: "Failed to create payment" };
      }
    },
    validatePayment: async (data) => {
      try {
        const { merchant_id, order_id, payment_id, payhere_amount, payhere_currency , status_code, md5sig, method } = data;
        const valid = verifyNotificationHash({
          merchantId: merchant_id,
          orderId: order_id,
          payhereAmount: payhere_amount,
          payhereCurrency: payhere_currency,
          statusCode: status_code,
          md5sig: md5sig,
        });
        if (!valid) return { success: false, error: "Invalid payment" };
        const payment = await repo.findByOrderId(order_id);
        if(!payment) return { success: false, error: "Payment not found" };
        if(status_code === '2'){
          payment.status = PaymentStatus.COMPLETED;
        }else if(status_code === '-2'){
          payment.status = PaymentStatus.FAILED;
        }else if(status_code === '-1'){
          payment.status = PaymentStatus.CANCELLED;
        }
        payment.payment_method = method.toLowerCase();
        payment.payment_id = payment_id;
        await payment.save();
        return { success: true };
      }catch (err) {
        return { success: false, error: "Failed to validate payment" };
      }
    },
    checkPaymentStatus: async (id) => {
      try {
        const payment = await repo.findById(id);
        if(!payment) return {success:false, error: "Payment not found"};
        return {success: true, payment};
      }catch (err) {
        return { success: false, error: "Failed to check payment status" };
      }
    },
    getPaymentById: async (id) => {
      const payment = await repo.findById(id);
      if (!payment) return { success: false, error: "Payment not found" };
      return { success: true, payment };
    },
    getPaymentByOrderId: async (orderId) => {
      const payment = await repo.findByOrderId(orderId);
      if (!payment)
        return { success: false, error: "Payment not found for this order" };
      return { success: true, payment };
    },
    getAllPayments: async (query) => {
      try {
        const payments = await repo.findAll(query);
        if (!payments) return { success: false, error: "No payments found" };
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
