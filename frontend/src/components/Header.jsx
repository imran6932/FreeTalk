export default function Header({ model, onModelChange, onClear, hasMessages, userId, username, models }) {
  return (
    <header className="header">
      <div className="header-left">
        <div className="avatar-ring">
          <span className="avatar-emoji">❤️</span>
        </div>
        <div>
          <h1 className="bot-name">{username || "FreeTalk"}</h1>
          <span className="bot-status">● Online</span>
        </div>
      </div>
      <div className="header-right">
        {hasMessages && (
          <button className="btn-icon" onClick={onClear} title="New chat">
            🗑️
          </button>
        )}
      </div>
    </header>
  );
}
