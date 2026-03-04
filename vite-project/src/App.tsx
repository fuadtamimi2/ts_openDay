import { useMemo, useState } from "react";

const THEME = {
  primaryBtn: "bg-sky-500 hover:bg-sky-600",
  primarySoft: "bg-sky-500/15",
  primaryText: "text-sky-300",
  ring: "focus:ring-sky-500",
  heroGrad: "from-sky-500/25 via-slate-950 to-slate-950",
  accentText: "text-yellow-300",
  accentBorder: "border-yellow-300/60",
  accentBg: "bg-yellow-300/10",
};

type FormState = {
  fullName: string;
  phone: string;
  email: string;
  track: string;
};

export default function App() {
  // ✅ change this later if you deploy
  const API_BASE = "http://localhost:5000";

  const tracks = useMemo(
    () => [
      "הנדסאי כללי",
      "אדריכלות נוף",
      "הנדסאי בטיחות",
      "הנדסת חשמל",
      'הנדסת מכונות - כטב"ם',
      "הנדסת קול (סאונד)",
      "הנדסת רכב",
      "הנדסת רכב חשמלי",
      "מכינה טכנולוגית",
      "ניהול הבנייה",
      "ניהול הבנייה בשילוב הכשרה למנהלי עבודה",
      "תוכנה",
    ],
    []
  );

  const [open, setOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const [form, setForm] = useState<FormState>({
    fullName: "",
    phone: "",
    email: "",
    track: tracks[0],
  });

  const errors = useMemo(() => {
    const e: Partial<Record<keyof FormState, string>> = {};
    if (!form.fullName.trim()) e.fullName = "חובה למלא שם מלא";
    if (!/^0\d{8,9}$/.test(form.phone.trim()))
      e.phone = "טלפון לא תקין (למשל 05XXXXXXXX)";
    if (!/^\S+@\S+\.\S+$/.test(form.email.trim()))
      e.email = "אימייל לא תקין";
    if (!form.track) e.track = "בחר/י מסלול";
    return e;
  }, [form]);

  const isValid = Object.keys(errors).length === 0;

  function resetForm() {
    setForm({
      fullName: "",
      phone: "",
      email: "",
      track: tracks[0],
    });
  }

  async function submitForm(e: React.FormEvent) {
    e.preventDefault();
    if (!isValid) return;

    setLoading(true);
    setApiError(null);

    try {
      // ✅ Debug – you will see this in DevTools console
      console.log("[SUBMIT] sending form =>", form);

      const res = await fetch(`${API_BASE}/api/registrations`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      // Read response safely (always)
      const raw = await res.text();
      let data: any = null;
      try {
        data = raw ? JSON.parse(raw) : null;
      } catch {
        data = raw;
      }

      console.log("[SUBMIT] status =>", res.status);
      console.log("[SUBMIT] response =>", data);

      if (!res.ok) {
        const msg =
          (data && (data.message || data.error)) ||
          `Request failed: ${res.status}`;
        throw new Error(msg);
      }

      // ✅ only success closes modal
      setSubmitted(true);
      setOpen(false);
      resetForm();
      setTimeout(() => setSubmitted(false), 4000);
    } catch (err: any) {
      // ✅ keep modal open so user sees the error
      setApiError(err?.message || "שגיאה");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div dir="rtl" className="min-h-screen bg-slate-950 text-white overflow-x-hidden">
      {/* TOP NAV */}
      <header className="sticky top-0 z-50 backdrop-blur bg-slate-950/80 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className={`h-9 w-9 grid place-items-center rounded-xl border border-white/10 ${THEME.primarySoft}`}
            >
              🎓
            </div>
            <div className="font-extrabold text-lg">
              מחלקת הנדסאים <span className={THEME.accentText}>Ariel</span>
            </div>
          </div>

          <nav className="hidden md:flex gap-6 text-sm text-slate-300">
            <a href="#why" className="hover:text-white">למה הנדסאים</a>
            <a href="#tracks" className="hover:text-white">מסלולים</a>
            <a href="#faq" className="hover:text-white">שאלות</a>
          </nav>

          <button
            onClick={() => {
              setApiError(null);
              setOpen(true);
            }}
            className={`px-4 py-2 rounded-lg ${THEME.primaryBtn} font-semibold text-sm transition`}
          >
            להרשמה
          </button>
        </div>
      </header>

   {/* HERO */}
<section className="relative w-full overflow-hidden">
  <div
    className={`absolute inset-0 bg-gradient-to-b ${THEME.heroGrad} pointer-events-none`}
  />

  <div className="relative z-10 max-w-7xl mx-auto px-6 py-28 text-center">
    <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-200/80">
      <span className="h-2 w-2 rounded-full bg-yellow-300" />
      מקומות מוגבלים • הרשמה מהירה
    </div>

    <h1 className="mt-6 text-4xl md:text-6xl font-black leading-tight">
      יום פתוח להנדסאים
    </h1>

    <p className="mt-6 text-lg md:text-xl text-slate-300 max-w-3xl mx-auto">
      בואו להכיר מקרוב את מסלולי ההנדסאים, המרצים, המעבדות והאפשרויות לקריירה
      טכנולוגית מבטיחה.
    </p>

    <div className="mt-10 flex flex-row-reverse gap-4 justify-center">
      <button
        onClick={() => {
          setApiError(null);
          setOpen(true);
        }}
        className="px-8 py-3 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold"
      >
        להרשמה ליום הפתוח
      </button>

      <a
        href="#tracks"
        className="px-8 py-3 rounded-xl border border-white/20 text-white hover:bg-white/10 inline-flex items-center justify-center"
      >
        מידע נוסף
      </a>
    </div>

    {submitted && (
      <div className="mt-8 max-w-xl mx-auto rounded-2xl border border-emerald-400/20 bg-emerald-400/10 p-4 text-sm text-emerald-200">
        ✅ ההרשמה נשלחה ונשמרה במערכת בהצלחה.
      </div>
    )}
  </div>
</section>

      {/* WHY */}
      <section id="why" className="max-w-7xl mx-auto px-6 py-24">
        <h2 className="text-3xl font-bold text-center mb-14">למה ללמוד הנדסאים?</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <Card title="לימודים מעשיים" text="עבודה במעבדות, פרויקטים אמיתיים והתנסות בטכנולוגיות מתקדמות." />
          <Card title="קריירה מבוקשת" text="בוגרי הנדסאים משתלבים במהירות בתעשייה ובחברות מובילות." />
          <Card title="ליווי אישי" text="כיתות קטנות, יחס אישי וליווי לאורך כל מסלול הלימודים." />
        </div>
      </section>

      {/* TRACKS */}
      <section id="tracks" className="bg-slate-900 border-y border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-24">
          <h2 className="text-3xl font-bold text-center mb-14">מסלולי לימוד</h2>

          <div className="grid md:grid-cols-3 gap-8">
            {tracks.slice(0, 3).map((t) => (
              <Track
                key={t}
                title={t}
                onChoose={() => {
                  setForm((p) => ({ ...p, track: t }));
                  setApiError(null);
                  setOpen(true);
                }}
              />
            ))}
          </div>

          <div className="mt-10 flex justify-center">
            <button
              onClick={() => {
                setApiError(null);
                setOpen(true);
              }}
              className={`px-6 py-3 rounded-xl border ${THEME.accentBorder} ${THEME.accentBg} hover:bg-yellow-300/15 transition font-bold`}
            >
              לא בטוח/ה? נרשמים ונעזור לבחור מסלול
            </button>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="max-w-7xl mx-auto px-6 py-24">
        <h2 className="text-3xl font-bold text-center mb-14">שאלות נפוצות</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <Faq q="כמה זמן נמשך היום הפתוח?" a="בדרך כלל 2-5 שעות, כולל זמן לשאלות." />
          <Faq q="אפשר להגיע בלי רקע?" a="כן. מסבירים הכל ומכוונים למסלול מתאים." />
          <Faq q="זה מתאים למי שעובד/ת?" a="כן. יש פתרונות וגמישות לפי מסלול." />
          <Faq q="מה קורה אחרי ההרשמה?" a="מקבלים אישור מקום + פרטי הגעה." />
        </div>
      </section>

      {/* FOOTER */}
      <footer className="text-center text-slate-400 text-sm py-8 border-t border-white/10">
        © כל הזכויות שמורות — מחלקת הנדסאים
      </footer>

      {/* MODAL */}
      {open && (
        <div className="fixed inset-0 z-[60]">
          <div className="absolute inset-0 bg-black/60" onClick={() => setOpen(false)} />
          <div className="absolute inset-0 flex items-center justify-center p-4">
            <div className="w-full max-w-lg rounded-2xl border border-white/10 bg-slate-950 shadow-2xl">
              <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
                <div className="font-black text-lg">
                  הרשמה ליום הפתוח <span className={THEME.accentText}>•</span>
                </div>
                <button
                  onClick={() => setOpen(false)}
                  className="px-3 py-1 rounded-lg bg-white/5 hover:bg-white/10"
                >
                  ✕
                </button>
              </div>

              <form className="p-5 space-y-4" onSubmit={submitForm}>
                {apiError && (
                  <div className="rounded-xl border border-rose-400/20 bg-rose-400/10 p-3 text-sm text-rose-200">
                    ❌ {apiError}
                  </div>
                )}

                <Field label="שם מלא" error={errors.fullName}>
                  <Input
                    value={form.fullName}
                    onChange={(v) => setForm((p) => ({ ...p, fullName: v }))}
                    placeholder="שם + שם משפחה"
                    ring={THEME.ring}
                  />
                </Field>

                <Field label="טלפון" error={errors.phone}>
                  <Input
                    value={form.phone}
                    onChange={(v) => setForm((p) => ({ ...p, phone: v }))}
                    placeholder="05XXXXXXXX"
                    ring={THEME.ring}
                  />
                </Field>

                <Field label="אימייל" error={errors.email}>
                  <Input
                    value={form.email}
                    onChange={(v) => setForm((p) => ({ ...p, email: v }))}
                    placeholder="you@example.com"
                    type="email"
                    ring={THEME.ring}
                  />
                </Field>

                <Field label="מה תרצה/י ללמוד?" error={errors.track}>
                  <select
                    value={form.track}
                    onChange={(e) => setForm((p) => ({ ...p, track: e.target.value }))}
                    className={`w-full px-4 py-3 rounded-lg bg-slate-800 border border-white/10 outline-none focus:ring-2 ${THEME.ring}`}
                  >
                    {tracks.map((t) => (
                      <option key={t} value={t} className="bg-slate-900">
                        {t}
                      </option>
                    ))}
                  </select>
                </Field>

                <button
                  type="submit"
                  disabled={!isValid || loading}
                  className={[
                    "w-full py-4 rounded-xl font-bold text-lg transition",
                    !isValid || loading ? "bg-white/10 cursor-not-allowed opacity-60" : THEME.primaryBtn,
                  ].join(" ")}
                >
                  {loading ? "שולח..." : "שליחת טופס"}
                </button>

                <div className={`text-xs text-slate-400 ${THEME.accentBg} ${THEME.accentBorder} border rounded-xl p-3`}>
                  הטופס נשלח לשרת המקומי ונשמר ב־MongoDB (open_day → registrations).
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* COMPONENTS */

function Card({ title, text }: { title: string; text: string }) {
  return (
    <div className="rounded-2xl bg-white/5 border border-white/10 p-8 text-center">
      <h3 className="text-xl font-bold mb-4">{title}</h3>
      <p className="text-slate-300">{text}</p>
    </div>
  );
}

function Track({ title, onChoose }: { title: string; onChoose: () => void }) {
  return (
    <button
      onClick={onChoose}
      className="rounded-2xl bg-white/5 border border-white/10 p-8 text-center hover:bg-white/10 transition"
    >
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-sm text-slate-300">לחץ/י להרשמה למסלול</p>
    </button>
  );
}

function Faq({ q, a }: { q: string; a: string }) {
  return (
    <details className="rounded-2xl bg-white/5 border border-white/10 p-5">
      <summary className="cursor-pointer font-bold">{q}</summary>
      <p className="mt-2 text-slate-300 text-sm">{a}</p>
    </details>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <div className="text-sm text-slate-300">{label}</div>
      {children}
      {error && <div className="text-xs text-rose-300">{error}</div>}
    </div>
  );
}

function Input({
  value,
  onChange,
  placeholder,
  type = "text",
  ring,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  type?: string;
  ring: string;
}) {
  return (
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      type={type}
      className={`w-full px-4 py-3 rounded-lg bg-slate-800 border border-white/10 outline-none focus:ring-2 ${ring}`}
    />
  );
}