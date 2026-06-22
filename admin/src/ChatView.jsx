function formatTime(iso) {
  if (!iso) return "";
  return new Date(iso).toLocaleString();
}

export default function ChatView({ data }) {
  if (!data) return null;
  const { meta, gender, messages, count } = data;

  return (
    <div className="chat-view">
      {/* User info bar */}
      <div className="chat-view-header">
        <div className="cv-info">
          <div className="cv-avatar">{gender === "male" ? "👨" : gender === "female" ? "👩" : "👤"}</div>
          <div>
            <div className="cv-uid">{meta?.user_id || data.user_id}</div>
            <div className="cv-meta-row">
              <span>💻 {meta?.device_name || "Unknown"}</span>
              <span className="dot-sep">·</span>
              <span>🧬 {gender || "unknown"}</span>
              <span className="dot-sep">·</span>
              <span>💬 {count} messages</span>
            </div>
            <div className="cv-meta-row">
              <span>🕐 First seen: {formatTime(meta?.first_seen)}</span>
              <span className="dot-sep">·</span>
              <span>🕑 Last seen: {formatTime(meta?.last_seen)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="cv-messages">
        {messages.length === 0
          ? <div className="no-msgs">No messages yet</div>
          : messages.map((msg, i) => (
            <div key={i} className={`cv-msg ${msg.role === "user" ? "cv-user" : "cv-bot"}`}>
              <div className="cv-role">{msg.role === "user" ? "👤 User" : "🤖 Priya/Arjun"}</div>
              <div className="cv-bubble">{msg.content}</div>
            </div>
          ))
        }
      </div>
    </div>
  );
}
