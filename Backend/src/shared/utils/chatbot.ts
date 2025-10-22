import { GoogleGenerativeAI } from "@google/generative-ai";
import Order from "../../models/Order";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function getChatbotResponse(
  userQuestion: string
): Promise<string> {
  try {
    const orders = await Order.find({}).limit(50);

    if (orders.length === 0) {
      return "There is no order data in the database to analyze.";
    }

    const orderSummary = orders.map((order) => ({
      total: order.total_amount,
      date: order.order_date,
      status: order.order_status,
    }));

    const prompt = `You are a sales analyst. Answer based on this data:

Orders: ${JSON.stringify(orderSummary)}

Question: ${userQuestion}

Answer concisely.`;

    // Use the first one (most likely to work)
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash", // Note: added 'models/' prefix
    });

    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();
    console.log("Chatbot Response:", response);

    return text;
  } catch (error) {
    console.error("Chatbot Error:", error);

    if (error instanceof Error) {
      if (error.message.includes("429") || error.message.includes("quota")) {
        return "Rate limit exceeded. Please wait and try again.";
      }
      if (error.message.includes("404")) {
        return "Model configuration error. Please check the model name.";
      }
      return `Error: ${error.message}`;
    }

    return "An unexpected error occurred.";
  }
}
