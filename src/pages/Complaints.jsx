// src/pages/Complaints.jsx
import { useState } from "react";
import { Link } from "react-router-dom";
import { Badge, Chips, Empty, Table, Page } from "../components/ui";
import { complaints } from "../data";

const Link2 = ({ to, children }) => (
  <Link
    to={to}
    className="font-semibold text-navy underline-offset-4 hover:underline"
  >
    {children}
  </Link>
);

export function Complaints() {
  const [f, setF] = useState("قيد الانتظار");
  const rows = complaints.filter(
    (c) => f === "الكل" || c.status === f || c.cat === f,
  );
  return (
    <Page title="الشكاوى" sub="3 قيد الانتظار">
      <div className="mb-4 flex justify-end">
        <Chips
          items={["الكل", "قيد الانتظار", "مالية", "عامة", "مغلقة"]}
          value={f}
          onChange={setF}
        />
      </div>
      {rows.length ? (
        <Table
          cols={[
            "الرقم",
            "المرسل",
            "التصنيف",
            "النوع",
            "المرجع",
            "التاريخ",
            "الحالة",
            "",
          ]}
          rows={rows}
          render={(c) => [
            c.id,
            c.from,
            c.cat,
            c.type,
            c.ref,
            c.date,
            <Badge>{c.status}</Badge>,
            <Link2 to={`/complaints/${c.id}`}>مراجعة</Link2>,
          ]}
        />
      ) : (
        <div className="rounded-xl border border-line bg-white">
          <Empty
            title="لا يوجد شكاوى قيد الانتظار"
            text="الشكاوى المعالجة تظهر هنا. عندما يرسل الراكب شكوى جديدة ستظهر هنا مباشرة."
          />
        </div>
      )}
    </Page>
  );
}
