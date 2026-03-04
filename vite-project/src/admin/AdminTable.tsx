import { useEffect, useState } from "react";

const API = "http://localhost:5000";

type Item = {
  _id: string;
  fullName: string;
  phone: string;
  email: string;
  track: string;
  createdAt: string;
};

export default function AdminTable({ token, onLogout }: { token: string; onLogout: () => void }) {
  const [items, setItems] = useState<Item[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      setError("");

      const res = await fetch(`${API}/api/registrations/admin`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log("using token:", token);

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        if (res.status === 401) {
          onLogout();
          return;
        }
        setError(data?.message || "Failed to load");
        return;
      }

      const data = await res.json();
      setItems(data.items || []);
    })();
  }, [token, onLogout]);

  async function downloadCsv() {
    const res = await fetch(`${API}/api/registrations/admin.csv`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) return alert("CSV failed");

    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "registrations.csv";
    a.click();

    window.URL.revokeObjectURL(url);
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Registrations</h1>
          <div className="flex gap-3">
            <button onClick={downloadCsv} className="px-4 py-2 rounded bg-emerald-600">
              Download CSV
            </button>
            <button onClick={onLogout} className="px-4 py-2 rounded bg-white/10">
              Logout
            </button>
          </div>
        </div>

        {error && <div className="mb-4 text-rose-300">{error}</div>}

        <div className="rounded-xl border border-white/10 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-white/5">
              <tr>
                <th className="p-3 text-right">שם</th>
                <th className="p-3 text-right">טלפון</th>
                <th className="p-3 text-right">אימייל</th>
                <th className="p-3 text-right">מסלול</th>
                <th className="p-3 text-right">תאריך</th>
              </tr>
            </thead>
            <tbody>
              {items.map((x) => (
                <tr key={x._id} className="border-t border-white/10">
                  <td className="p-3">{x.fullName}</td>
                  <td className="p-3">{x.phone}</td>
                  <td className="p-3">{x.email}</td>
                  <td className="p-3">{x.track}</td>
                  <td className="p-3">{new Date(x.createdAt).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
