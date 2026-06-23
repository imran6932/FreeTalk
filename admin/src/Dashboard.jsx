import { useState, useEffect } from "react";
import UserList from "./UserList";
import ChatView from "./ChatView";

const API_BASE =
  import.meta.env.VITE_API_URL ||
  "http://localhost:8000";

export function apiFetch(path, auth) {
  return fetch(
    `${API_BASE}${path}`,
    {
      headers: {
        Authorization: `Basic ${auth}`,
      },
    }
  );
}

export default function Dashboard({
  auth,
  onLogout,
}) {
  const [users, setUsers] = useState([]);
  const [total, setTotal] = useState(0);
  const [selectedUser, setSelectedUser] = useState(null);
  const [chatData, setChatData] = useState(null);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [loadingChat, setLoadingChat] = useState(false);
  const [search, setSearch] = useState("");

  useEffect(() => {
    loadUsers();
  }, [auth]);

  const loadUsers = async () => {
    try {
      setLoadingUsers(true);

      const response =
        await apiFetch(
          "/admin/users",
          auth
        );

      const data =
        await response.json();

      setUsers(data.users || []);
      setTotal(data.total || 0);
    } catch (e) {
      console.error(
        "Failed to load users:",
        e
      );
    } finally {
      setLoadingUsers(false);
    }
  };

  const selectUser = async (
    user
  ) => {
    setSelectedUser(user);
    setChatData(null);
    setLoadingChat(true);

    try {
      const response =
        await apiFetch(
          `/admin/users/${user.user_id}/history`,
          auth
        );

      const data =
        await response.json();

      setChatData(data);
    } catch (e) {
      console.error(
        "Failed to load chat:",
        e
      );
    } finally {
      setLoadingChat(false);
    }
  };

  const handleDeleteUser = (
    userId
  ) => {
    setUsers((prev) =>
      prev.filter(
        (u) =>
          u.user_id !== userId
      )
    );

    setTotal((prev) =>
      Math.max(0, prev - 1)
    );

    if (
      selectedUser?.user_id ===
      userId
    ) {
      setSelectedUser(null);
      setChatData(null);
    }
  };

  const filtered =
    users.filter((u) => {
      const term =
        search.toLowerCase();

      return (
        u.user_id
          .toLowerCase()
          .includes(term) ||
        (
          u.device_name || ""
        )
          .toLowerCase()
          .includes(term) ||
        (u.gender || "")
          .toLowerCase()
          .includes(term)
      );
    });

  return (
    <div className="dashboard">
      <aside className="sidebar">
        <div className="sidebar-header">
          <div className="sidebar-logo">
            <span>🛡️</span>

            <div>
              <h2>
                FreeTalk Admin
              </h2>

              <span className="total-badge">
                {total} users
              </span>
            </div>
          </div>

          <button
            className="logout-btn"
            onClick={onLogout}
            title="Logout"
          >
            ↩ Logout
          </button>
        </div>

        <div className="search-wrap">
          <input
            className="search-input"
            placeholder="🔍 Search users..."
            value={search}
            onChange={(e) =>
              setSearch(
                e.target.value
              )
            }
          />
        </div>

        {loadingUsers ? (
          <div className="sidebar-loading">
            <div className="spin" />
            Loading users...
          </div>
        ) : (
          <UserList
            users={filtered}
            selected={
              selectedUser
            }
            onSelect={
              selectUser
            }
            auth={auth}
            onDeleted={
              handleDeleteUser
            }
          />
        )}
      </aside>

      <main className="chat-panel">
        {!selectedUser ? (
          <div className="empty-state">
            <span className="empty-icon">
              💬
            </span>

            <p>
              Select a user to
              view their chat
              history
            </p>
          </div>
        ) : loadingChat ? (
          <div className="empty-state">
            <div className="spin" />
            <p>
              Loading chat...
            </p>
          </div>
        ) : (
          <ChatView
            data={chatData}
          />
        )}
      </main>
    </div>
  );
}