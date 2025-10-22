import { Payment, IPayment } from "../../models/Payment";
import { CreatePaymentDTO } from "../../dtos/payment.DTO";
import { withErrorHandling } from "../../shared/utils/CustomException";

/**
 * Defines the contract for the payment repository, specifying the methods for data access operations related to payments.
 */
export interface IPaymentRepository {
  /**
   * Creates a new payment record.
   * @param data - The DTO containing the details for the new payment.
   * @returns A promise that resolves to the created payment document or null.
   */
  create(data: Partial<CreatePaymentDTO>): Promise<IPayment | null>;
  /**
   * Finds a payment by its unique ID.
   * @param id - The ID of the payment to find.
   * @returns A promise that resolves to the payment document or null if not found.
   */
  findById(id: string): Promise<IPayment | null>;
  /**
   * Finds a payment associated with a specific order ID.
   * @param orderId - The ID of the order.
   * @returns A promise that resolves to the payment document or null if not found.
   */
  findByOrderId(orderId: string): Promise<IPayment | null>;
  /**
   * Retrieves all payments that match a given query.
   * @param query - A Mongoose query object for filtering payments.
   * @returns A promise that resolves to an array of payment documents or null.
   */
  findAll(query: any): Promise<IPayment[] | null>;
  /**
   * Updates an existing payment record.
   * @param id - The ID of the payment to update.
   * @param data - The partial DTO containing the fields to update.
   * @returns A promise that resolves to the updated payment document or null.
   */
  update(id: string, data: Partial<CreatePaymentDTO>): Promise<IPayment | null>;
  /**
   * Deletes a payment by its unique ID.
   * @param id - The ID of the payment to delete.
   * @returns A promise that resolves to true if deletion was successful, otherwise false.
   */
  delete(id: string): Promise<boolean | null>;
}

/**
 * The concrete implementation of the IPaymentRepository interface.
 * Each method is wrapped with a higher-order function `withErrorHandling` to ensure
 * consistent error management across the repository.
 */
export const PaymentRepository: IPaymentRepository = {
  /** Creates a new Payment document. */
  create: withErrorHandling(async (data) => {
    const payment = new Payment(data);
    return await payment.save();
  }),
  /** Finds a single payment by its document ID. */
  findById: withErrorHandling(async (id) => {
    return await Payment.findById(id);
  }),
  /** Finds a single payment by its associated order ID. */
  findByOrderId: withErrorHandling(async (orderId) => {
    return await Payment.findOne({ order_id: orderId });
  }),
  /** Retrieves all payments matching the query, sorted by most recent. */
  findAll: withErrorHandling(async (query) => {
    return await Payment.find(query).sort({ createdAt: -1 });
  }),
  /** Finds a payment by ID and updates it with new data. */
  update: withErrorHandling(async (id, data) => {
    return await Payment.findByIdAndUpdate(id, data, { new: true });
  }),
  /** Deletes a payment by its document ID. */
  delete: withErrorHandling(async (id) => {
    const result = await Payment.findByIdAndDelete(id);
    return result !== null;
  }),
};
