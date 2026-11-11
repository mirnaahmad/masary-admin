// src/pages/Reports.jsx
import { useState } from "react";
import { Badge, Btn, Card, Chips, Table, Page } from "../components/ui";
import { tx, byLine, fmt } from "../data";

export function Reports() {
  const [p, setP] = useState("شهري");
  const cards = [
    ["صافي الإيرادات", "184,212,500", true],
    ["العمولات", "37,500"],
    ["الرحلات", "73,700"],
    ["إجمالي الإيرادات", "184,250,000"],
  ];
  return (
    <Page
      title="التقارير المالية"
      sub="تشرين الثاني 2026"
      actions={
        <>
          <Chips
            items={["يومي", "أسبوعي", "شهري", "مخصص"]}
            value={p}
            onChange={setP}
          />
          <Btn variant="ghost">تصدير Excel</Btn>
        </>
      }
    >
      <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {cards.map(([l, v, d]) => (
          <div
            key={l}
            className={`rounded-xl border p-5 ${d ? "border-navy bg-navy text-white" : "border-line bg-white"}`}
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
        <Card title="سجل المعاملات">
          <Table
            cols={["المعاملة", "الراكب", "الخط", "المبلغ", "الوقت", "الحالة"]}
            rows={tx}
            render={(t) => [
              t.id,
              t.who,
              t.line,
              fmt(t.amount),
              t.time,
              <Badge tone="green">ناجحة</Badge>,
            ]}
          />
        </Card>
        <Card title="الإيرادات حسب الخط">
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
