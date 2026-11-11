// src/pages/Lines.jsx
import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { Badge, Btn, Chips, Empty, Table, Page } from "../components/ui";
import { lines } from "../data";

const Search = ({ v, set, ph }) => (
  <input
    className="inp max-w-sm bg-white"
    value={v}
    onChange={(e) => set(e.target.value)}
    placeholder={ph}
    aria-label={ph}
  />
);
const Link2 = ({ to, children }) => (
  <Link
    to={to}
    className="font-semibold text-navy underline-offset-4 hover:underline"
  >
    {children}
  </Link>
);

export function Lines() {
  const [q, setQ] = useState(""),
    [f, setF] = useState("الكل");
  const rows = useMemo(
    () =>
      lines.filter(
        (l) => l.name.includes(q) && (f === "الكل" || l.status === f),
      ),
    [q, f],
  );
  return (
    <Page
      title="الخطوط والمحطات"
      sub={`${lines.length} خطوط`}
      actions={<Btn>+ خط جديد</Btn>}
    >
      <div className="mb-4 flex items-center justify-between">
        <Search v={q} set={setQ} ph="ابحث باسم الخط أو المحطة..." />
        <Chips items={["الكل", "منشور", "مسودة"]} value={f} onChange={setF} />
      </div>
      {rows.length ? (
        <Table
          cols={["رقم", "الخط", "المحطات", "الباصات", "الحالة", ""]}
          rows={rows}
          render={(l) => [
            l.id,
            l.name,
            l.stops,
            l.buses,
            <Badge>{l.status}</Badge>,
            <Link2 to={`/lines/${l.id}`}>
              {l.status === "مسودة" ? "تكملة" : "تعديل"}
            </Link2>,
          ]}
        />
      ) : (
        <div className="rounded-xl border border-line bg-white">
          <Empty
            title="ما في خطوط لسا"
            text="ابدأ بإضافة أول خط: ارسم مساره على الخريطة وحدد محطاته بالترتيب."
            action={<Btn>+ إضافة أول خط</Btn>}
          />
        </div>
      )}
    </Page>
  );
}
