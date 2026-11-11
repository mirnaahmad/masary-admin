// src/pages/Login.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Btn, Field } from "../components/ui";

export function Login() {
  const go = useNavigate();
  const [u, setU] = useState("admin.homs"),
    [p, setP] = useState(""),
    [err, setErr] = useState("");
  const submit = (e) => {
    e.preventDefault();
    p.length < 4 ? setErr("كلمة المرور قصيرة، أدخل 4 أحرف على الأقل") : go("/");
  };
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="flex flex-col justify-center bg-navy p-16 text-white">
        <div className="mb-3 text-4xl font-extrabold">
          مساري <span className="text-lime">MASARY</span>
        </div>
        <h2 className="text-2xl font-bold">طريقك.. بوقتك</h2>
        <p className="mt-3 max-w-sm text-sm text-slate-300">
          لوحة إدارة الخطوط والحافلات والسائقين لمدينة حمص، تابع الشكاوى
          والتقارير المالية في مكان واحد.
        </p>
      </div>
      <form onSubmit={submit} className="m-auto w-full max-w-sm space-y-4 p-8">
        <div>
          <h1 className="text-xl font-extrabold">تسجيل الدخول</h1>
          <p className="text-xs text-slate-400">
            للموظفين المعتمدين من مديرية النقل
          </p>
        </div>
        <Field label="اسم المستخدم">
          <input
            className="inp"
            value={u}
            onChange={(e) => setU(e.target.value)}
          />
        </Field>
        <Field label="كلمة المرور" error={err}>
          <input
            type="password"
            className="inp"
            value={p}
            onChange={(e) => setP(e.target.value)}
          />
        </Field>
        <Btn className="w-full py-3">تسجيل الدخول</Btn>
      </form>
    </div>
  );
}
