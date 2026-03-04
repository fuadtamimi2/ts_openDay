import { useState } from "react";

export default function AdminLogin({ onLogin }: { onLogin: (t: string) => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("http://localhost:5000/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error((data as any).message || "Login failed");
      }

      const token = (data as any).token;
      if (!token) throw new Error("No token returned from server");

      onLogin(token);
    } catch (err: any) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen grid place-items-center bg-slate-950 text-white">
      <form
        onSubmit={submit}
        className="w-full max-w-sm space-y-4 p-6 border border-white/10 rounded-xl"
      >
        <h1 className="text-xl font-bold text-center">Admin Login</h1>

        {error && <div className="text-rose-300 text-sm">{error}</div>}

        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="email@ariel.ac.il"
          className="w-full px-4 py-3 bg-slate-800 rounded"
        />

        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          className="w-full px-4 py-3 bg-slate-800 rounded"
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-sky-600 rounded font-bold disabled:opacity-60"
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
}
