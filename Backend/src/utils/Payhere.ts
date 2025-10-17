import md5 from "crypto-js/md5";
import { AddressDTO } from "../dtos/user.DTO";

/**
 * Defines the structure for customer information required by the PayHere gateway.
 */
interface CustomerInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  country?: string;
}

/**
 * Defines the structure for the main payment data object used to create a request.
 */
interface PaymentData {
  orderId: string;
  amount: number;
  currency: string;
  description: string;
  customerInfo: CustomerInfo;
  returnUrl: string;
  cancelUrl: string;
  notifyUrl: string;
}

/**
 * Defines the parameters for the notification hash verification function.
 */
interface VerifyNotificationParams {
  merchantId: string;
  orderId: string;
  payhereAmount: string;
  payhereCurrency: string;
  statusCode: string;
  md5sig: string;
}

/**
 * The PayHere Merchant ID, retrieved from environment variables.
 * This is a public identifier for your merchant account.
 */
const merchantId: string = process.env.PAYHERE_MERCHANT_ID!;
/**
 * The PayHere Merchant Secret, retrieved from environment variables.
 * This is a private key used for generating and verifying security hashes.
 * It should never be exposed on the client-side.
 */
const merchantSecret: string = process.env.PAYHERE_SECRET!;

// A startup check to ensure that essential environment variables are configured.
// Logs an error if the merchant ID or secret is missing.
if (!merchantId || !merchantSecret) {
  console.error(
    "PayHere merchant ID or secret is not defined in environment variables."
  );
}

/**
 * Generates the security hash required for a PayHere payment request.
 * The hash is created by concatenating several pieces of data with the merchant secret
 * and then applying an MD5 hash.
 *
 * @param orderId - The unique ID for the order in your system.
 * @param amount - The payment amount as a string.
 * @returns The uppercase MD5 hash string.
 */
const generateHash = (orderId: string, amount: string): string => {
  // Hash the merchant secret first, as per PayHere documentation.
  let hashedSecret = md5(merchantSecret).toString().toUpperCase();
  // Format the amount to two decimal places without commas.
  let amountFormated = parseFloat(amount)
    .toLocaleString("en-us", { minimumFractionDigits: 2 })
    .replace(/,/g, "");
  let currency = "LKR";
  // Concatenate the required fields in the correct order.
  const hashString = `${merchantId}${orderId}${amountFormated}${currency.toUpperCase()}${hashedSecret}`;
  // Return the final MD5 hash of the concatenated string.
  return md5(hashString).toString().toUpperCase();
};

/**
 * Verifies the integrity of a notification received from PayHere's server.
 * This is a critical security step to ensure the notification is authentic and has not been tampered with.
 * It recalculates the hash using the received data and compares it to the `md5sig` from PayHere.
 *
 * @param params - An object containing all the required fields from the PayHere notification.
 * @returns `true` if the calculated hash matches the received `md5sig`, otherwise `false`.
 */
export const verifyNotificationHash = (
  params: VerifyNotificationParams
): boolean => {
  const {
    merchantId: receivedMerchantId,
    orderId,
    payhereAmount,
    payhereCurrency,
    statusCode,
    md5sig,
  } = params;
  // Hash the merchant secret.
  const hashedSecret = md5(merchantSecret).toString().toUpperCase();
  // Concatenate the notification fields in the exact order specified by PayHere documentation.
  const stringToHash = `${receivedMerchantId}${orderId}${payhereAmount}${payhereCurrency}${statusCode}${hashedSecret}`;
  // Calculate the MD5 hash of the concatenated string.
  const calculatedHash = md5(stringToHash).toString().toUpperCase();
  // Compare the calculated hash with the signature received from PayHere.
  return md5sig === calculatedHash;
};

/**
 * A simple utility function to format a number to a string with two decimal places.
 *
 * @param amount - The number to format.
 * @returns The formatted amount as a string (e.g., 123.45).
 */
const formatAmount = (amount: number): string => {
  return amount.toFixed(2);
};

/**
 * Creates the complete payment request object to be sent to the PayHere gateway.
 * This function assembles all required data, generates the security hash, and returns an object
 * that can be used to initiate a payment.
 *
 * @param paymentData - An object containing all the necessary details for the payment.
 * @returns A plain JavaScript object representing the full payment request.
 */
export const createPaymentRequest = (paymentData: PaymentData): object => {
  const {
    orderId,
    amount,
    currency,
    description,
    customerInfo,
    returnUrl,
    cancelUrl,
    notifyUrl,
  } = paymentData;

  // Format the amount and generate the security hash.
  const formattedAmount = formatAmount(amount);
  const hash = generateHash(orderId, formattedAmount);

  // Assemble the final request object with all required fields.
  // The keys must match the names expected by the PayHere API.
  const requestObject: { [key: string]: any } = {
    merchant_id: merchantId,
    return_url: returnUrl,
    cancel_url: cancelUrl,
    notify_url: notifyUrl,
    order_id: orderId,
    items: description,
    amount: formattedAmount,
    currency: currency.toUpperCase(),
    hash: hash,
    first_name: customerInfo.firstName,
    last_name: customerInfo.lastName,
    email: customerInfo.email,
    phone: customerInfo.phone,
    address: customerInfo.address,
    city: customerInfo.city,
    country: customerInfo.country || "Sri Lanka",
  };

  return requestObject;
};

/**
 * A utility function to convert a structured address object into a single-line string.
 * This is useful for passing address information to payment gateways that expect a single address field.
 *
 * @param address - The AddressDTO object containing structured address parts.
 * @returns A comma-separated string of the address parts.
 */
export const singelLineAddress = (address: AddressDTO): string => {
  const parts = [address.street, address.city, address.state];

  return parts.filter(Boolean).join(", ");
};
