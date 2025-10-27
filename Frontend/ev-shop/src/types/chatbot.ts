export type ChatMessage = {
  id: number;
  text: string;
  sender: "user" | "bot";
};