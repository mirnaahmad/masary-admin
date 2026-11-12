// src/pages/Reports.jsx
import { useState, useMemo } from "react";
import { Badge, Btn, Card, Chips, Table, Page } from "../components/ui";
import { tx as defaultTx, byLine, fmt, tempLines } from "../data";

const Search = ({ v, set, ph }) => (
  <input
    className="inp max-w-sm bg-white"
    value={v}
    onChange={(e) => set(e.target.value)}
    placeholder={ph}
    aria-label={ph}
  />
);

export function Reports() {
  const [period, setPeriod] = useState("شهري");
  const [searchQuery, setSearchQuery] = useState("");
  const [lineFilter, setLineFilter] = useState("الكل");
  const [statusFilter, setStatusFilter] = useState("الكل");

  // تواريخ الفترة المخصصة (Custom Date Range)
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [list] = useState(defaultTx);

  // فلترة المعاملات بالبحث، الخط، الحالة، والفترة المخصصة
  const filteredTx = useMemo(
    () =>
      list.filter((t) => {
        const matchesSearch = (t.id + t.who + t.line + (t.bus || ""))
          .toLowerCase()
          .includes(searchQuery.trim().toLowerCase());
        const matchesLine =
          lineFilter === "الكل" || t.line.includes(lineFilter);
        const matchesStatus =
          statusFilter === "الكل" || t.status === statusFilter;

        // فلترة مخصصة حسب التاريخ إذا تم اختيارها
        let matchesDate = true;
        if (period === "مخصص" && startDate && endDate && t.rawDate) {
          matchesDate = t.rawDate >= startDate && t.rawDate <= endDate;
        }

        return matchesSearch && matchesLine && matchesStatus && matchesDate;
      }),
    [list, searchQuery, lineFilter, statusFilter, period, startDate, endDate],
  );

  const cards = [
    ["صافي الإيرادات", "184,212,500", true],
    ["العمولات", "37,500"],
    ["الرحلات", "73,700"],
    ["إجمالي الإيرادات", "184,250,000"],
  ];

  // دالة لتحديد لون شارة الحالة لكل معاملة
  const getStatusTone = (status) => {
    switch (status) {
      case "ناجحة":
        return "green";
      case "معلقة":
        return "amber";
      case "مرفوضة":
        return "red";
      case "مسترجعة":
        return "navy";
      default:
        return "gray";
    }
  };

  return (
    <Page
      title="التقارير المالية والأرباح"
      sub="تشرين الثاني 2026 · تحليل حركة الإيرادات والمعاملات"
      actions={
        <>
          <Chips
            items={["يومي", "أسبوعي", "شهري", "مخصص"]}
            value={period}
            onChange={setPeriod}
          />
          <Btn variant="ghost">تصدير Excel</Btn>
        </>
      }
    >
      {/* إذا اختارت المديرة "مخصص"، تظهر خانات تحديد التواريخ */}
      {period === "مخصص" && (
        <div className="mb-4 flex flex-wrap items-center gap-3 rounded-xl border border-navy/20 bg-navy/5 p-4">
          <span className="text-xs font-bold text-navy">
            تحديد الفترة المخصصة:
          </span>
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500">من:</span>
            <input
              type="date"
              className="inp bg-white py-1 text-xs"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500">إلى:</span>
            <input
              type="date"
              className="inp bg-white py-1 text-xs"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
          {(startDate || endDate) && (
            <button
              type="button"
              onClick={() => {
                setStartDate("");
                setEndDate("");
              }}
              className="text-xs font-semibold text-red-600 hover:underline"
            >
              إلغاء التواريخ
            </button>
          )}
        </div>
      )}

      {/* بطاقات الإحصائيات العليا */}
      <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {cards.map(([l, v, d]) => (
          <div
            key={l}
            className={`rounded-xl border p-5 ${
              d ? "border-navy bg-navy text-white" : "border-line bg-white"
            }`}
          >
            <div
              className={`text-xs ${d ? "text-slate-300" : "text-slate-400"}`}
            >
              {l}
            </div>
            <div className="mt-1 text-2xl font-extrabold">{v}</div>
            <small className="text-slate-400">ل.س</small>
          </div>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-[1fr_340px]">
        {/* قسم سجل المعاملات مع فلاتر البحث والحالة */}
        <Card
          title="سجل المعاملات المالية"
          action={
            <div className="flex flex-wrap items-center gap-2">
              <Search
                v={searchQuery}
                set={setSearchQuery}
                ph="ابحث برقم المعاملة أو الراكب..."
              />
              <select
                className="inp !w-auto bg-white py-1.5 text-xs"
                value={lineFilter}
                onChange={(e) => setLineFilter(e.target.value)}
              >
                <option value="الكل">— كل الخطوط —</option>
                {tempLines.map((l) => (
                  <option key={l.id} value={l.name}>
                    {l.name}
                  </option>
                ))}
              </select>
              <select
                className="inp !w-auto bg-white py-1.5 text-xs"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="الكل">— كل الحالات —</option>
                <option value="ناجحة">ناجحة</option>
                <option value="معلقة">معلقة</option>
                <option value="مرفوضة">مرفوضة</option>
                <option value="مسترجعة">مسترجعة</option>
              </select>
            </div>
          }
        >
          <Table
            cols={["المعاملة", "الراكب", "الخط", "المبلغ", "الوقت", "الحالة"]}
            rows={filteredTx}
            render={(t) => [
              <span className="font-mono text-xs font-bold text-navy">
                {t.id}
              </span>,
              <b>{t.who}</b>,
              t.line,
              <span className="font-bold text-navy">{fmt(t.amount)} ل.س</span>,
              t.time,
              <Badge tone={getStatusTone(t.status || "ناجحة")}>
                {t.status || "ناجحة"}
              </Badge>,
            ]}
          />
        </Card>

        {/* توزيع الإيرادات حسب الخطوط */}
        <Card title="توزيع الإيرادات حسب الخطوط">
          <ul className="space-y-4">
            {byLine.map(([n, w]) => (
              <li key={n}>
                <div className="mb-1 flex justify-between text-xs">
                  <span className="font-semibold">{n}</span>
                  <span className="text-slate-400">{w}%</span>
                </div>
                <div className="h-2 rounded-full bg-slate-100">
                  <div
                    className="h-2 rounded-full bg-navy"
                    style={{ width: `${w}%` }}
                  />
                </div>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </Page>
  );
}
