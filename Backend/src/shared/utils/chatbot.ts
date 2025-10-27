// ============================================
// CHATBOT SERVICE
// ============================================
import { GoogleGenerativeAI } from "@google/generative-ai";
import Order from "../../entities/Order";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

interface OrderData {
  total: number;
  date: Date;
  status: string;
  items?: string[];
  customer?: string;
}

export async function getChatbotResponse(
  userQuestion: string
): Promise<string> {
  try {
    const orders = await Order.find({}).limit(50).sort({ order_date: -1 });

    if (orders.length === 0) {
      return "There is no order data in the database to analyze.";
    }

    // Enhanced order summary with more details
    const orderSummary: OrderData[] = orders.map((order) => ({
      total: order.total_amount,
      date: order.order_date,
      status: order.order_status,
    }));

    // Calculate aggregate statistics
    const stats = calculateStats(orderSummary);

    const prompt = `You are an expert sales analyst assistant. Analyze the data and answer questions clearly and concisely.

ORDER DATA:
${JSON.stringify(orderSummary, null, 2)}

STATISTICS:
- Total Orders: ${stats.totalOrders}
- Total Revenue: $${stats.totalRevenue.toFixed(2)}
- Average Order Value: $${stats.avgOrderValue.toFixed(2)}
- Completed Orders: ${stats.completedOrders}
- Pending Orders: ${stats.pendingOrders}
- Cancelled Orders: ${stats.cancelledOrders}

USER QUESTION: ${userQuestion}

INSTRUCTIONS:
- Provide specific numbers and insights
- Be concise but informative
- Use bullet points for lists
- Format currency values properly
- If the question cannot be answered with available data, say so clearly`;

    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash-exp",
    });

    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();

    return text;
  } catch (error) {
    console.error("Chatbot Error:", error);
    return handleChatbotError(error);
  }
}

// ============================================
//  HELPER FUNCTIONS
// ============================================
function calculateStats(orders: OrderData[]) {
  return {
    totalOrders: orders.length,
    totalRevenue: orders.reduce((sum, order) => sum + order.total, 0),
    avgOrderValue: orders.reduce((sum, order) => sum + order.total, 0) / orders.length,
    completedOrders: orders.filter((o) => o.status.toLowerCase() === "completed").length,
    pendingOrders: orders.filter((o) => o.status.toLowerCase() === "pending").length,
    cancelledOrders: orders.filter((o) => o.status.toLowerCase() === "cancelled").length,
  };
}

function handleChatbotError(error: unknown): string {
  if (error instanceof Error) {
    if (error.message.includes("429") || error.message.includes("quota")) {
      return "⚠️ Rate limit exceeded. Please wait a moment and try again.";
    }
    if (error.message.includes("404")) {
      return "⚠️ Model not found. Please check your Gemini API configuration.";
    }
    if (error.message.includes("API key")) {
      return "⚠️ Invalid API key. Please check your GEMINI_API_KEY environment variable.";
    }
    return `Error: ${error.message}`;
  }
  return "An unexpected error occurred. Please try again.";
}

// ============================================
// SUGGESTED QUESTION CATEGORIES
// ============================================
export const SUGGESTED_QUESTIONS = {
  revenue: [
    "What is the total revenue?",
    "What's the average order value?",
    "Show me revenue trends",
    "What are the top selling products?",
    "Compare this month vs last month revenue",
  ],
  orders: [
    "How many orders do we have?",
    "How many pending orders?",
    "What's the order completion rate?",
    "Show me recent orders",
    "How many orders were cancelled?",
  ],
  analytics: [
    "What are the busiest days?",
    "Show me sales performance",
    "What's the conversion rate?",
    "Identify sales trends",
    "What are peak ordering times?",
  ],
  customers: [
    "Who are our top customers?",
    "What's the customer retention rate?",
    "How many new customers this month?",
    "Show customer purchase patterns",
  ],
  forecasting: [
    "Predict next month's sales",
    "What's the projected revenue?",
    "Forecast inventory needs",
    "Estimate growth rate",
  ],
};