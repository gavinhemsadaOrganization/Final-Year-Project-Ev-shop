interface MessageAlertProps {
  message: { id: number; text: string; type: string } | null;
}

export const MessageAlert = ({ message }: MessageAlertProps) => {
  if (!message) return null;
  return (
    <div
      key={message.id}
      className={`absolute top-[41%] left-1/2 transform -translate-x-1/2 w-[70%] text-center p-3 rounded-md font-medium shadow-lg z-10 ${
        message.type === "success"
          ? "bg-green-100 text-green-700 border border-green-400"
          : "bg-red-100 text-red-700 border border-red-400"
      }`}
    >
      {message.text}
    </div>
  );
};
