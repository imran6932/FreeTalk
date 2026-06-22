import { useState } from "react";
import Login from "./Login";
import Dashboard from "./Dashboard";

export default function App() {
  const [auth, setAuth] = useState(() => {
    const stored = sessionStorage.getItem("ft_admin_auth");
    return stored || null;
  });

  const handleLogin = (credentials) => {
    setAuth(credentials);
    sessionStorage.setItem("ft_admin_auth", credentials);
  };

  const handleLogout = () => {
    sessionStorage.removeItem("ft_admin_auth");
    setAuth(null);
  };

  return auth
    ? <Dashboard auth={auth} onLogout={handleLogout} />
    : <Login onLogin={handleLogin} />;
}
