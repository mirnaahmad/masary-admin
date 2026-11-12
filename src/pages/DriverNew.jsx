// src/pages/DriverNew.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Btn, Card, Field, Page } from "../components/ui";
import {
  tempDrivers,
  setTempDrivers,
  tempLines,
  tempBuses,
  setTempBuses,
} from "../data";

export function DriverNew() {
  const go = useNavigate();

  const [form, setForm] = useState({
    name: "",
    phone: "",
    licenseNumber: "",
    licenseExpiry: "",
    line: "—",
    busId: "",
  });

  const [errors, setErrors] = useState({});
  const [credentials, setCredentials] = useState(null);
  const [copied, setCopied] = useState(false);

  const availableBuses = tempBuses.filter(
    (b) => form.line === "—" || b.line === form.line || b.line === "—",
  );

  const handleChange = (key) => (e) => {
    const val = e.target.value;
    setForm((prev) => ({
      ...prev,
      [key]: val,
      ...(key === "line" ? { busId: "" } : {}),
    }));
    if (errors[key]) {
      setErrors((prev) => ({ ...prev, [key]: "" }));
    }
  };

  const validate = () => {
    const newErrors = {};
    const cleanName = form.name.trim();
    const cleanPhone = form.phone.replace(/\s+/g, "");

    if (!cleanName || cleanName.length < 4) {
      newErrors.name = "يرجى إدخال الاسم الكامل للسائق (4 أحرف على الأقل).";
    }

    if (!/^09\d{8}$/.test(cleanPhone)) {
      newErrors.phone =
        "يرجى إدخال رقم موبايل سوري صحيح يبدأ بـ 09 (10 أرقام).";
    } else if (
      tempDrivers.some((d) => d.phone.replace(/\s+/g, "") === cleanPhone)
    ) {
      newErrors.phone = "رقم الهاتف مسجل مسبقاً لسائق آخر.";
    }

    if (!form.licenseNumber.trim()) {
      newErrors.licenseNumber = "رقم رخصة القيادة مطلوب.";
    }

    if (!form.licenseExpiry) {
      newErrors.licenseExpiry = "يرجى تحديد تاريخ انتهاء الشهادة.";
    } else {
      const today = new Date().toISOString().split("T")[0];
      if (form.licenseExpiry <= today) {
        newErrors.licenseExpiry =
          "تاريخ الشهادة منتهي الصلاحية! يرجى إدخال شهادة سارية.";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSaveAndGenerate = () => {
    if (!validate()) return;

    const selectedBus = tempBuses.find(
      (b) => String(b.id) === String(form.busId),
    );
    const nextId = tempDrivers.length + 1;

    const randomCode = Math.floor(100 + Math.random() * 900);
    const username = `driver.${nextId}.${randomCode}`;
    const tempPassword = `Ms-${Math.random()
      .toString(36)
      .slice(2, 7)
      .toUpperCase()}`;

    const newDriver = {
      id: nextId,
      name: form.name.trim(),
      phone: form.phone.trim(),
      licenseNumber: form.licenseNumber.trim(),
      licenseExpiry: form.licenseExpiry,
      user: username,
      line: form.line,
      bus: selectedBus ? `باص ${selectedBus.id} · ${selectedBus.plate}` : "—",
      // الحالة الافتراضية أوفلاين حتى يفتح السائق تطبيقه ويشارك موقعه للركاب
      status: "أوفلاين",
    };

    const updatedDrivers = [...tempDrivers, newDriver].map((d, idx) => ({
      ...d,
      id: idx + 1,
    }));
    setTempDrivers(updatedDrivers);

    if (selectedBus) {
      const updatedBuses = tempBuses.map((b) =>
        b.id === selectedBus.id
          ? {
              ...b,
              driver: newDriver.name,
              line: form.line !== "—" ? form.line : b.line,
            }
          : b,
      );
      setTempBuses(updatedBuses);
    }

    setCredentials({ username, password: tempPassword });
  };

  const handleCopy = () => {
    if (!credentials) return;
    const text = `بيانات الدخول لتطبيق السائق:\nاسم المستخدم: ${credentials.username}\nكلمة المرور المؤقتة: ${credentials.password}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <Page
      title="إضافة سائق جديد"
      sub="السائقون · تسجيل وتوليد حساب"
      actions={
        credentials ? (
          <Btn variant="lime" onClick={() => go("/drivers")}>
            تم · العودة لقائمة السائقين
          </Btn>
        ) : (
          <>
            <Btn variant="ghost" onClick={() => go("/drivers")}>
              إلغاء
            </Btn>
            <Btn onClick={handleSaveAndGenerate}>حفظ وتوليد الحساب</Btn>
          </>
        )
      }
    >
      <div className="grid gap-4 lg:grid-cols-[1fr_320px]">
        <div className="space-y-4">
          <Card title="البيانات الشخصية والرخصة">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <Field label="الاسم الكامل *" error={errors.name}>
                <input
                  className={`inp ${errors.name ? "border-red-400" : ""}`}
                  placeholder="مثال: رامي العلي"
                  value={form.name}
                  onChange={handleChange("name")}
                  disabled={Boolean(credentials)}
                />
              </Field>
              <Field label="رقم الهاتف *" error={errors.phone}>
                <input
                  className={`inp ${errors.phone ? "border-red-400" : ""}`}
                  placeholder="0933555341"
                  value={form.phone}
                  onChange={handleChange("phone")}
                  disabled={Boolean(credentials)}
                />
              </Field>
              <Field label="رقم رخصة السواقة *" error={errors.licenseNumber}>
                <input
                  className={`inp ${errors.licenseNumber ? "border-red-400" : ""}`}
                  placeholder="مثال: 849201"
                  value={form.licenseNumber}
                  onChange={handleChange("licenseNumber")}
                  disabled={Boolean(credentials)}
                />
              </Field>
              <Field
                label="تاريخ انتهاء الشهادة *"
                error={errors.licenseExpiry}
              >
                <input
                  className={`inp ${errors.licenseExpiry ? "border-red-400" : ""}`}
                  type="date"
                  value={form.licenseExpiry}
                  onChange={handleChange("licenseExpiry")}
                  disabled={Boolean(credentials)}
                />
              </Field>
            </div>
          </Card>

          <Card title="الربط بخط وحافلة (اختياري)">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <Field label="الخط">
                <select
                  className="inp"
                  value={form.line}
                  onChange={handleChange("line")}
                  disabled={Boolean(credentials)}
                >
                  <option value="—">— بدون خط حالياً —</option>
                  {tempLines.map((l) => (
                    <option key={l.id} value={l.name}>
                      {l.name}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="الحافلة">
                <select
                  className="inp"
                  value={form.busId}
                  onChange={handleChange("busId")}
                  disabled={Boolean(credentials)}
                >
                  <option value="">— بدون حافلة حالياً —</option>
                  {availableBuses.map((b) => (
                    <option key={b.id} value={b.id}>
                      باص #{b.id} · حمص {b.plate} ({b.status})
                    </option>
                  ))}
                </select>
              </Field>
            </div>
            <p className="mt-2 text-xs text-slate-400">
              يُنشأ الحساب بحالة «أوفلاين» تلقائياً، ويتحول إلى «أونلاين» فور
              تسجيل دخول السائق وتفعيل مشاركة موقعه للركاب.
            </p>
          </Card>
        </div>

        <div className="rounded-xl bg-navy p-5 text-white">
          <h3 className="font-bold">بيانات دخول السائق</h3>
          <p className="mt-1 text-xs text-slate-300">
            {credentials
              ? "تم إنشاء الحساب بنجاح! انسخ البيانات وأرسلها للسائق، لن تظهر كلمة المرور مرة أخرى."
              : "املأ بيانات السائق واضغط «حفظ وتوليد الحساب» لإصدار اسم مستخدم وكلمة مرور مؤقتة."}
          </p>

          {credentials ? (
            <div className="mt-4 space-y-2.5 text-sm">
              <div className="rounded-lg bg-white/10 p-3">
                <small className="block text-xs text-slate-300">
                  اسم المستخدم
                </small>
                <div className="mt-0.5 font-mono font-bold text-lime">
                  {credentials.username}
                </div>
              </div>
              <div className="rounded-lg bg-white/10 p-3">
                <small className="block text-xs text-slate-300">
                  كلمة المرور المؤقتة
                </small>
                <div className="mt-0.5 font-mono font-bold text-lime">
                  {credentials.password}
                </div>
              </div>
              <Btn variant="lime" className="mt-3 w-full" onClick={handleCopy}>
                {copied ? "✓ تم النسخ للحافظة" : "نسخ بيانات الدخول"}
              </Btn>
            </div>
          ) : (
            <div className="mt-5 rounded-lg border border-white/15 bg-white/5 p-4 text-center text-xs text-slate-300">
              بانتظار حفظ البيانات لتوليد الحساب...
            </div>
          )}
        </div>
      </div>
    </Page>
  );
}
