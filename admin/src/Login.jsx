import { useState } from "react";

export default function Login({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8000";

  const handleSubmit = async () => {
    if (!username || !password) return;
    setLoading(true);
    setError("");
    try {
      const credentials = btoa(`${username}:${password}`);
      const res = await fetch(`${API_BASE}/admin/users`, {
        headers: { Authorization: `Basic ${credentials}` },
      });
      if (res.status === 401) {
        setError("Invalid username or password.");
        return;
      }
      if (!res.ok) throw new Error("Server error");
      onLogin(credentials);
    } catch (e) {
      setError("Could not connect to server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-logo">🛡️</div>
        <h1 className="login-title">FreeTalk Admin</h1>
        <p className="login-sub">Sign in to view chat history</p>
        {error && <div className="login-error">{error}</div>}
        <input
          className="login-input"
          placeholder="Username"
          value={username}
          onChange={e => setUsername(e.target.value)}
          onKeyDown={e => e.key === "Enter" && handleSubmit()}
          autoFocus
        />
        <input
          className="login-input"
          placeholder="Password"
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          onKeyDown={e => e.key === "Enter" && handleSubmit()}
        />
        <button className="login-btn" onClick={handleSubmit} disabled={loading}>
          {loading ? "Signing in..." : "Sign In"}
        </button>
      </div>
    </div>
  );
}
