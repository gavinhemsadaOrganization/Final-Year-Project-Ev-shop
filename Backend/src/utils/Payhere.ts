import md5 from "crypto-js/md5";
import { AddressDTO } from "../dtos/user.DTO";

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

// --- MODULE CONSTANTS ---
// Read environment variables once and use them across functions.
const merchantId: string = process.env.PAYHERE_MERCHANT_ID!;
const merchantSecret: string = process.env.PAYHERE_SECRET!;

if (!merchantId || !merchantSecret) {
  console.error(
    "PayHere merchant ID or secret is not defined in environment variables."
  );
}

const generateHash = (
  orderId: string,
  amount: string
): string => {
  let hashedSecret = md5(merchantSecret).toString().toUpperCase();
  let amountFormated = parseFloat(amount)
    .toLocaleString("en-us", { minimumFractionDigits: 2 })
     .replace(/,/g, "");
  let currency = "LKR";
  const hashString = `${merchantId}${orderId}${amountFormated}${currency.toUpperCase()}${hashedSecret}`;
  return md5(hashString).toString().toUpperCase();
};

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
  const hashedSecret = md5(merchantSecret).toString().toUpperCase();
  const stringToHash = `${receivedMerchantId}${orderId}${payhereAmount}${payhereCurrency}${statusCode}${hashedSecret}`;
  const calculatedHash = md5(stringToHash).toString().toUpperCase();
  return md5sig === calculatedHash;
};

const formatAmount = (amount: number): string => {
  return amount.toFixed(2);
};

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

  const formattedAmount = formatAmount(amount);
  const hash = generateHash(orderId, formattedAmount);

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

export const singelLineAddress = (address: AddressDTO): string => {
    const parts = [
    address.street,
    address.city,
    address.state,
  ];

  return parts.filter(Boolean).join(', ');
}