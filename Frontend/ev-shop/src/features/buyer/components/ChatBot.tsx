import React, { useState, useRef, useEffect } from "react";
import { CloseIcon, SendIcon } from "@/assets/icons/icons";
import type { ChatMessage } from "@/types";

type ChatbotProps = {
  onClose: () => void;
  messages: ChatMessage[];
  onSendMessage: (text: string) => void;
};

export const Chatbot: React.FC<ChatbotProps> = ({
  onClose,
  messages,
  onSendMessage,
}) => {
  const [inputValue, setInputValue] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      onSendMessage(inputValue.trim());
      setInputValue("");
    }
  };

  return (
    <div className="fixed bottom-24 right-6 w-80 h-[28rem] bg-white rounded-xl shadow-2xl flex flex-col z-40 animate-slideInUp">
      <header className="bg-blue-600 text-white p-4 flex justify-between items-center rounded-t-xl">
        <h3 className="font-bold text-lg">EV-Shop Assistant</h3>
        <button
          onClick={onClose}
          className="hover:bg-blue-700 p-1 rounded-full"
        >
          <CloseIcon className="h-5 w-5" />
        </button>
      </header>
      <div className="flex-1 p-4 overflow-y-auto">
        <div className="space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex items-end gap-2 ${
                msg.sender === "user" ? "justify-end" : "justify-start"
              }`}
            >
              {msg.sender === "bot" && (
                <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold flex-shrink-0">
                  E
                </div>
              )}
              <div
                className={`max-w-[80%] p-3 rounded-2xl animate-popIn ${
                  msg.sender === "user"
                    ? "bg-blue-500 text-white rounded-br-none"
                    : "bg-gray-200 text-gray-800 rounded-bl-none"
                }`}
              >
                <p className="text-sm">{msg.text}</p>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>
      <footer className="p-2 border-t border-gray-200">
        <form onSubmit={handleSubmit} className="flex items-center gap-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 w-full px-4 py-2 bg-gray-100 border border-transparent rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="bg-blue-600 text-white p-2.5 rounded-full hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <SendIcon className="h-5 w-5" />
          </button>
        </form>
      </footer>
    </div>
  );
};