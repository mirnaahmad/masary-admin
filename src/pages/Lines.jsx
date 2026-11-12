// src/pages/Lines.jsx
import { useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Badge, Btn, Chips, Empty, Table, Page } from "../components/ui";
import { tempLines, setTempLines } from "../data";

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

export function Lines() {
  const go = useNavigate();
  const [q, setQ] = useState("");
  const [f, setF] = useState("الكل");
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [allLines, setAllLines] = useState(tempLines);

  const executeDelete = () => {
    if (!confirmDelete) return;
    const filtered = allLines.filter((l) => l.id !== confirmDelete.id);
    const reindexed = filtered.map((l, index) => ({
      ...l,
      id: index + 1,
    }));
    setAllLines(reindexed);
    setTempLines(reindexed);
    setConfirmDelete(null);
  };

  const rows = useMemo(
    () =>
      allLines.filter(
        (l) =>
          l.name.toLowerCase().includes(q.trim().toLowerCase()) &&
          (f === "الكل" || l.status === f),
      ),
    [allLines, q, f],
  );

  const isFiltering = q.trim() !== "" || f !== "الكل";

  return (
    <Page
      title="الخطوط والمحطات"
      sub={`${allLines.length} خطوط`}
      actions={<Btn onClick={() => go("/lines/new")}>+ خط جديد</Btn>}
    >
      {confirmDelete && (
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-navy/20 bg-navy px-4 py-3 text-white shadow-sm">
          <div className="flex items-center gap-2.5 text-sm">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-lime/20 text-xs font-bold text-lime">
              !
            </span>
            <span>
              هل تريدين حذف خط{" "}
              <strong className="text-lime">«{confirmDelete.name}»</strong>؟ لا
              يمكن التراجع عن هذا الإجراء.
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={executeDelete}
              className="rounded-lg bg-lime px-3.5 py-1.5 text-xs font-bold text-navy transition hover:opacity-90"
            >
              تأكيد الحذف
            </button>
            <button
              type="button"
              onClick={() => setConfirmDelete(null)}
              className="rounded-lg border border-white/20 px-3.5 py-1.5 text-xs font-semibold text-white transition hover:bg-white/10"
            >
              تراجع
            </button>
          </div>
        </div>
      )}

      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <Search v={q} set={setQ} ph="ابحث باسم الخط..." />
        <Chips items={["الكل", "منشور", "مسودة"]} value={f} onChange={setF} />
      </div>

      {rows.length > 0 ? (
        <Table
          cols={["رقم", "الخط", "التعرفة", "المحطات", "الباصات", "الحالة", ""]}
          rows={rows}
          render={(l) => [
            l.id,
            l.name,
            `${Number(l.fare || 1500).toLocaleString()} ل.س`,
            Array.isArray(l.stopsList) ? l.stopsList.length : l.stops,
            l.buses,
            <Badge>{l.status}</Badge>,
            <div className="flex items-center justify-end gap-2">
              <Link2 to={`/lines/${l.id}`}>
                {l.status === "مسودة" ? "تكملة" : "تعديل"}
              </Link2>
              <button
                type="button"
                onClick={() => setConfirmDelete(l)}
                title="حذف الخط"
                className="rounded-lg border border-line bg-white px-2.5 py-1 text-xs font-medium text-slate-500 transition hover:border-amber-300 hover:bg-amber-50 hover:text-amber-800"
              >
                حذف
              </button>
            </div>,
          ]}
        />
      ) : (
        <div className="rounded-xl border border-line bg-white">
          {isFiltering ? (
            <Empty
              title="ما لقينا خط بهالاسم"
              text={`لا توجد خطوط مطابقة لـ "${q}" ضمن فلتر "${f}".`}
              action={
                <Btn
                  variant="ghost"
                  onClick={() => {
                    setQ("");
                    setF("الكل");
                  }}
                >
                  مسح البحث
                </Btn>
              }
            />
          ) : (
            <Empty
              title="ما في خطوط لسا"
              text="ابدأ بإضافة أول خط: ارسم مساره على الخريطة وحدد محطاته بالترتيب."
              action={
                <Btn onClick={() => go("/lines/new")}>+ إضافة أول خط</Btn>
              }
            />
          )}
        </div>
      )}
    </Page>
  );
}
