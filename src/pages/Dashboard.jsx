// src/pages/Dashboard.jsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Badge, Btn, Card, Modal, Page, Skel } from "../components/ui";
import { MapView } from "../components/MapView";
import { api, useLoad } from "../api";
import { buses } from "../data";

function ReassignModal({ bus, onClose, onDone }) {
  const [pick, setPick] = useState(0),
    [un, setUn] = useState(true),
    [busy, setBusy] = useState(false);
  const spare = [
    ["باص 31 · احتياطي", "الكراجات · بعد 12 دقيقة"],
    ["باص 22 · من خط عكرمة – الزهراء", "يترك خطه الحالي"],
  ];
  const confirm = async () => {
    setBusy(true);
    await api.reassignBus(bus.id, [31, 22][pick], un);
    onDone(`تمت إعادة تعيين باص ${bus.id} وتحويل الركاب إلى ${spare[pick][0]}`);
  };
  return (
    <Modal
      title={`إعادة تعيين: الباص ${bus.id} معطل`}
      sub={`خط ${bus.line} · ركاب على الخط بانتظار بديل`}
      onClose={onClose}
      footer={
        <>
          <Btn disabled={busy} onClick={confirm}>
            {busy ? "جارٍ التأكيد..." : "تأكيد إعادة التعيين"}
          </Btn>
          <Btn variant="ghost" onClick={onClose}>
            إلغاء
          </Btn>
        </>
      }
    >
      <label className="mb-3 flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={un}
          onChange={(e) => setUn(e.target.checked)}
          className="accent-navy"
        />
        إلغاء تعيين السائق {bus.driver} من الخط
      </label>
      <div className="space-y-2">
        {spare.map(([t, s2], i) => (
          <label
            key={t}
            className={`flex cursor-pointer items-center justify-between rounded-lg border p-3 ${pick === i ? "border-navy bg-lime/30" : "border-line"}`}
          >
            <span>
              <b className="block text-sm">{t}</b>
              <small className="text-slate-500">{s2}</small>
            </span>
            <input
              type="radio"
              name="spare"
              checked={pick === i}
              onChange={() => setPick(i)}
              className="accent-navy"
            />
          </label>
        ))}
      </div>
      <p className="mt-3 rounded-lg bg-slate-50 p-2 text-xs text-slate-500">
        سيصل إشعار للسائق الجديد وللركاب المسجلين على الخط.
      </p>
    </Modal>
  );
}

export function Dashboard() {
  const go = useNavigate();
  const { data, loading, error } = useLoad(api.dashboard);
  const [open, setOpen] = useState(false),
    [pick, setPick] = useState(0),
    [msg, setMsg] = useState(""),
    [re, setRe] = useState(false),
    [busy, setBusy] = useState(false);

  // حالات لتتبع التنبيهات وإخفائها عند إتمامها
  const [alerts, setAlerts] = useState({
    lineCongestion: true,
    busBroken: true,
    complaint: true,
  });

  const opts = [
    ["باص 31 · احتياطي", "الموقع: الكراجات · بعد 12 دقيقة", 31],
    ["باص 33 · احتياطي", "الموقع: الإنشاءات · بعد 15 دقيقة", 33],
    ["باص 7 · خط الوعر – الساعة", "أقرب باص متاح حالياً", 7],
  ];

  if (loading)
    return (
      <Page title="الرئيسية" sub="جارٍ تحميل مواقع الحافلات...">
        <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {[0, 1, 2, 3].map((i) => (
            <Skel key={i} className="h-24" />
          ))}
        </div>
        <div className="grid gap-4 lg:grid-cols-[1fr_340px]">
          <Skel className="h-96" />
          <Skel className="h-96" />
        </div>
      </Page>
    );

  if (error)
    return (
      <Page title="الرئيسية">
        <Empty
          title="تعذر تحميل البيانات"
          text="تحقق من الاتصال بالخادم ثم أعد المحاولة."
          action={<Btn onClick={() => location.reload()}>إعادة المحاولة</Btn>}
        />
      </Page>
    );

  const send = async () => {
    setBusy(true);
    await api.sendExtraBus(5, opts[pick][2]);
    setBusy(false);
    setOpen(false);
    setMsg("تم إرسال الباص الإضافي إلى خط الكراجات – الجامعة");
    setAlerts((prev) => ({ ...prev, lineCongestion: false })); // إخفاء تنبيه الازدحام عند الحل
  };

  return (
    <Page
      title="الرئيسية"
      sub="تحديث مباشر"
      actions={
        <Link to="/lines">
          <Btn variant="ghost">عرض كل الخطوط</Btn>
        </Link>
      }
    >
      {msg && (
        <div
          role="status"
          className="mb-4 flex items-center justify-between rounded-lg bg-lime px-4 py-3 text-sm font-bold text-navy shadow-sm"
        >
          <span>{msg}</span>
          <button
            onClick={() => setMsg("")}
            aria-label="إغلاق"
            className="text-lg font-extrabold hover:opacity-70"
          >
            ✕
          </button>
        </div>
      )}

      <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {data.stats.map(([l, v], index) => {
          const handleCardClick = () => {
            if (index === 1)
              go("/reports"); // ركاب اليوم -> التقارير المالية
            else if (index === 2)
              go("/reports"); // إيرادات اليوم -> التقارير المالية
            else if (index === 3)
              go("/complaints"); // شكاوى جديدة -> الشكاوى
            else go("/buses"); // الباصات الشغالة -> الحافلات
          };
          return (
            <div
              key={l}
              onClick={handleCardClick}
              className="cursor-pointer rounded-xl border border-lime/50 bg-white p-5 shadow-[0_4px_12px_-2px_rgba(0,0,0,0.06)] ring-1 ring-lime/20 transition-all duration-200 hover:scale-[1.02] hover:bg-navy hover:text-white hover:shadow-lg group"
            >
              <div className="text-xs font-medium text-slate-500 group-hover:text-slate-300">
                {l}
              </div>
              <div className="mt-1 text-3xl font-extrabold text-navy group-hover:text-white">
                {v}
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid gap-4 lg:grid-cols-[1fr_340px]">
        <Card title="الخريطة الحية">
          <MapView className="h-80" buses={data.buses} />
        </Card>

        <Card title="التنبيهات">
          <ul className="space-y-3 text-sm">
            {alerts.lineCongestion && (
              <li className="rounded-lg border border-line p-3">
                <Badge tone="red">ازدحام</Badge>
                <p className="mt-2 font-semibold">
                  خط الكراجات – الجامعة مغلق بالكامل
                </p>
                <Btn
                  variant="lime"
                  className="mt-2 w-full"
                  onClick={() => setOpen(true)}
                >
                  إرسال باص إضافي
                </Btn>
              </li>
            )}

            {alerts.busBroken && (
              <li className="rounded-lg border border-line p-3">
                <Badge tone="red">معطل</Badge>
                <p className="mt-2">باص 9 معطل · الركاب يحتاجون بديلاً</p>
                <Btn className="mt-2 w-full" onClick={() => setRe(true)}>
                  إعادة تعيين
                </Btn>
              </li>
            )}

            {alerts.complaint && (
              <li
                onClick={() => go("/complaints/C-1042")}
                className="cursor-pointer rounded-lg border border-line p-3 transition hover:bg-slate-50"
              >
                <Badge tone="navy">شكوى</Badge>
                <p className="mt-2 font-semibold text-navy">
                  شكوى خصم مكرر من: رنا الحسن (انقر للمراجعة)
                </p>
              </li>
            )}

            {!alerts.lineCongestion &&
              !alerts.busBroken &&
              !alerts.complaint && (
                <p className="text-center text-xs text-slate-400 py-6">
                  لا توجد تنبيهات معلقة حالياً 🎉
                </p>
              )}
          </ul>
        </Card>
      </div>

      {open && (
        <Modal
          title="إرسال باص إضافي"
          sub="خط الكراجات – الجامعة · المقاعد المتاحة قليلة"
          onClose={() => setOpen(false)}
          footer={
            <>
              <Btn disabled={busy} onClick={send}>
                {busy ? "جارٍ الإرسال..." : "إرسال الباص"}
              </Btn>
              <Btn variant="ghost" onClick={() => setOpen(false)}>
                إلغاء
              </Btn>
            </>
          }
        >
          <div className="space-y-2">
            {opts.map(([t, s, id], i) => (
              <label
                key={id}
                className={`flex cursor-pointer items-center justify-between rounded-lg border p-3 ${pick === i ? "border-navy bg-lime/30" : "border-line"}`}
              >
                <span>
                  <b className="block text-sm">{t}</b>
                  <small className="text-slate-500">{s}</small>
                </span>
                <input
                  type="radio"
                  name="bus"
                  checked={pick === i}
                  onChange={() => setPick(i)}
                  className="accent-navy"
                />
              </label>
            ))}
          </div>
        </Modal>
      )}

      {re && (
        <ReassignModal
          bus={buses[1]}
          onClose={() => setRe(false)}
          onDone={(m) => {
            setRe(false);
            setMsg(m);
            setAlerts((prev) => ({ ...prev, busBroken: false }));
          }}
        />
      )}
    </Page>
  );
}
