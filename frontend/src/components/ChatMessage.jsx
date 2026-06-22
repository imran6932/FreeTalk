import { useState } from "react";

export default function ChatMessage({ message }) {
  const isUser = message.role === "user";
  const [copied, setCopied] = useState(false);

  const copy = () => {
    navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const format = (text) =>
    text
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      .replace(/\*(.*?)\*/g, "<em>$1</em>")
      .replace(/`(.*?)`/g, "<code>$1</code>")
      .replace(/\n/g, "<br/>");

  return (
    <div className={`msg-row ${isUser ? "msg-user" : "msg-bot"}`}>
      {!isUser && <div className="msg-avatar">🌸</div>}
      <div className={`bubble ${isUser ? "bubble-user" : "bubble-bot"} ${message.isError ? "bubble-error" : ""}`}>
        {isUser
          ? <p>{message.content}</p>
          : <div dangerouslySetInnerHTML={{ __html: format(message.content) }} />
        }
      </div>
      {isUser && <div className="msg-avatar user-av">👤</div>}
    </div>
  );
}
