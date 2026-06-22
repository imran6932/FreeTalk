function timeAgo(isoString) {
  if (!isoString) return "—";
  const diff = Date.now() - new Date(isoString).getTime();
  const mins = Math.floor(diff / 60000);
  const hrs = Math.floor(mins / 60);
  const days = Math.floor(hrs / 24);
  if (days > 0) return `${days}d ago`;
  if (hrs > 0) return `${hrs}h ago`;
  if (mins > 0) return `${mins}m ago`;
  return "just now";
}

const GENDER_ICON = { male: "👨", female: "👩", unknown: "👤" };
const DEVICE_ICON = (d = "") => {
  if (/iphone|ipad/i.test(d)) return "🍎";
  if (/android/i.test(d)) return "🤖";
  if (/windows/i.test(d)) return "🪟";
  if (/mac/i.test(d)) return "🍏";
  return "💻";
};

export default function UserList({ users, selected, onSelect }) {
  if (users.length === 0)
    return <div className="no-users">No users found</div>;

  return (
    <ul className="user-list">
      {users.map(u => (
        <li
          key={u.user_id}
          className={`user-item ${selected?.user_id === u.user_id ? "active" : ""}`}
          onClick={() => onSelect(u)}
        >
          <div className="user-avatar">{GENDER_ICON[u.gender] || "👤"}</div>
          <div className="user-info">
            <div className="user-id-text">{u.user_id}</div>
            <div className="user-meta-row">
              <span>{DEVICE_ICON(u.device_name)} {u.device_name || "Unknown"}</span>
              <span className="dot-sep">·</span>
              <span>💬 {u.message_count}</span>
            </div>
          </div>
          <div className="user-time">{timeAgo(u.last_seen)}</div>
        </li>
      ))}
    </ul>
  );
}
