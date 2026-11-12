// src/pages/Complaints.jsx
import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { Badge, Btn, Chips, Empty, Table, Page } from "../components/ui";
import { tempComplaints } from "../data";

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
    className="rounded-lg border border-line bg-slate-50 px-3 py-1 text-xs font-semibold text-navy transition hover:border-navy hover:bg-navy hover:text-white"
  >
    {children}
  </Link>
);

export function Complaints() {
  const [q, setQ] = useState("");
  const [f, setF] = useState("قيد الانتظار");

  const pendingCount = useMemo(
    () => tempComplaints.filter((c) => c.status === "قيد الانتظار").length,
    [],
  );

  const rows = useMemo(
    () =>
      tempComplaints.filter(
        (c) =>
          (String(c.id) + c.from + c.type + (c.ref || ""))
            .toLowerCase()
            .includes(q.trim().toLowerCase()) &&
          (f === "الكل" || c.status === f || c.cat === f),
      ),
    [q, f],
  );

  const isFiltering = q.trim() !== "" || f !== "الكل";

  return (
    <Page
      title="الشكاوى"
      sub={`${pendingCount} قيد الانتظار · ${tempComplaints.length} إجمالي`}
    >
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <Search
          v={q}
          set={setQ}
          ph="ابحث برقم الشكوى أو اسم الراكب أو النوع..."
        />
        <Chips
          items={["الكل", "قيد الانتظار", "مالية", "عامة", "مغلقة"]}
          value={f}
          onChange={setF}
        />
      </div>

      {rows.length > 0 ? (
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
            <span className="font-mono font-semibold text-navy">{c.id}</span>,
            <b>{c.from}</b>,
            c.cat,
            c.type,
            c.ref || "—",
            c.date,
            <Badge>{c.status}</Badge>,
            <div className="flex justify-end">
              <Link2 to={`/complaints/${c.id}`}>
                {c.status === "مغلقة" ? "التفاصيل" : "مراجعة"}
              </Link2>
            </div>,
          ]}
        />
      ) : (
        <div className="rounded-xl border border-line bg-white">
          <Empty
            title={
              f === "قيد الانتظار" && !q.trim()
                ? "لا يوجد شكاوى قيد الانتظار"
                : "لا توجد شكاوى مطابقة"
            }
            text={
              f === "قيد الانتظار" && !q.trim()
                ? "تمت معالجة جميع الشكاوى الواردة! عندما يرسل الراكب شكوى جديدة ستظهر هنا مباشرة."
                : "جرّب تغيير كلمة البحث أو اختيار فلتر آخر."
            }
            action={
              isFiltering && (
                <Btn
                  variant="ghost"
                  onClick={() => {
                    setQ("");
                    setF("الكل");
                  }}
                >
                  عرض كل الشكاوى
                </Btn>
              )
            }
          />
        </div>
      )}
    </Page>
  );
}
