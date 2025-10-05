import { GoogleGenerativeAI } from '@google/generative-ai';
import Order from '../models/Order';

// Initialize the Gemini client
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function getChatbotResponse(userQuestion: string): Promise<string> {
    // 1. Fetch all order data from the database
    const orders = await Order.find({});
    if (orders.length === 0) {
        return "There is no order data in the database to analyze.";
    }

    // 2. Create a detailed, dynamic prompt for the Gemini model
    const prompt = `
        You are a helpful sales data analyst for a small business.
        Your task is to answer questions based on the provided sales data.
        The data is an array of JSON objects, where each object is an order.

        **Sales Data:**
        ${JSON.stringify(orders, null, 2)}

        ---

        **User's Question:** "${userQuestion}"

        Please provide a clear and concise answer based *only* on the data provided.
    `;

    // 3. Call the Gemini API with the prompt
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const result = await model.generateContent(prompt);
    const response = await result.response;

    return response.text();
}