export default function Message({ message, isStreaming }) {
  const isUser = message.role === "user";

  const formatText = (text) =>
    text
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      .replace(/\*(.*?)\*/g, "<em>$1</em>")
      .replace(/`(.*?)`/g, "<code>$1</code>")
      .replace(/\n/g, "<br/>");

  return (
    <div className={`msg-row ${isUser ? "msg-user" : "msg-bot"}`}>
      {!isUser && <div className="bot-avatar">🌸</div>}
      <div className={`bubble ${isUser ? "bubble-user" : "bubble-bot"} ${message.isError ? "bubble-error" : ""}`}>
        {isUser ? (
          <p className="bubble-text">{message.content}</p>
        ) : message.content === "" && isStreaming ? (
          <div className="typing-dots">
            <span /><span /><span />
          </div>
        ) : (
          <p
            className="bubble-text"
            dangerouslySetInnerHTML={{ __html: formatText(message.content) }}
          />
        )}
        {isStreaming && message.content !== "" && (
          <span className="cursor" />
        )}
      </div>
    </div>
  );
}
