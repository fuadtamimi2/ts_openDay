import { useState } from "react";
import AdminLogin from "./AdminLogin";
import AdminTable from "./AdminTable";

export default function AdminPage() {
  const [token, setToken] = useState<string>(() => localStorage.getItem("admin_token") || "");

  function onLogin(t: string) {
    localStorage.setItem("admin_token", t);
    setToken(t);
  }

  function onLogout() {
    localStorage.removeItem("admin_token");
    setToken("");
  }

  return token ? (
    <AdminTable token={token} onLogout={onLogout} />
  ) : (
    <AdminLogin onLogin={onLogin} />
  );
}
