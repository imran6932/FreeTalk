import { useEffect, useRef } from "react";
import ChatMessage from "./ChatMessage";
import TypingDots from "./TypingDots";

export default function ChatWindow({ messages, streaming }) {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="chat-window">
      {messages
        .filter(msg => !(msg.role === "assistant" && msg.content === ""))
        .map((msg, i) => (
          <ChatMessage key={i} message={msg} />
        ))}
      {streaming && messages[messages.length - 1]?.content === "" && (
        <TypingDots />
      )}
      <div ref={bottomRef} />
    </div>
  );
}
