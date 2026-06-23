import { useState } from "react";

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

const GENDER_ICON = {
  male: "👨",
  female: "👩",
  unknown: "👤",
};

const DEVICE_ICON = (d = "") => {
  if (/iphone|ipad/i.test(d)) return "🍎";
  if (/android/i.test(d)) return "🤖";
  if (/windows/i.test(d)) return "🪟";
  if (/mac/i.test(d)) return "🍏";
  return "💻";
};

const API_BASE =
  import.meta.env.VITE_API_URL ||
  "http://localhost:8000";

export default function UserList({
  users,
  selected,
  onSelect,
  auth,
  onDeleted,
}) {
  const [deleting, setDeleting] =
    useState(null);

  const handleDelete = async (
    e,
    userId
  ) => {
    e.stopPropagation();

    const ok = window.confirm(
      `Delete all chats for ${userId}?`
    );

    if (!ok) return;

    try {
      setDeleting(userId);


      const response =
        await fetch(
          `${API_BASE}/admin/users/${userId}`,
          {
            method: "DELETE",
            headers: {
            Authorization: `Basic ${auth}`,
          },
          }
        );

      if (!response.ok) {
        throw new Error(
          "Delete failed"
        );
      }

      onDeleted?.(userId);
    } catch (err) {
      alert(
        "Failed to delete user"
      );
      console.error(err);
    } finally {
      setDeleting(null);
    }
  };

  if (users.length === 0) {
    return (
      <div className="no-users">
        No users found
      </div>
    );
  }

  return (
    <ul className="user-list">
      {users.map((u) => (
        <li
          key={u.user_id}
          className={`user-item ${
            selected?.user_id ===
            u.user_id
              ? "active"
              : ""
          }`}
          onClick={() => onSelect(u)}
        >
          <div className="user-avatar">
            {GENDER_ICON[u.gender] ||
              "👤"}
          </div>

          <div className="user-info">
            <div className="user-id-text">
              {u.user_id}
            </div>

            <div className="user-meta-row">
              <span>
                {DEVICE_ICON(
                  u.device_name
                )}{" "}
                {u.device_name ||
                  "Unknown"}
              </span>

              <span className="dot-sep">
                ·
              </span>

              <span>
                💬 {u.message_count}
              </span>
            </div>
          </div>

          <div className="user-actions">
            <div className="user-time">
              {timeAgo(
                u.last_seen
              )}
            </div>

            <button
              className="delete-user-btn"
              onClick={(e) =>
                handleDelete(
                  e,
                  u.user_id
                )
              }
              disabled={
                deleting ===
                u.user_id
              }
              title="Delete Chat"
            >
              {deleting ===
              u.user_id
                ? "⏳"
                : "🗑️"}
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}