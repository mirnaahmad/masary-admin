// src/pages/Buses.jsx
import { useState } from "react";
import {
  Badge,
  Btn,
  Chips,
  Empty,
  Table,
  Modal,
  Field,
  Page,
} from "../components/ui";
import { buses as defaultBuses, lines } from "../data";

const Search = ({ v, set, ph }) => (
  <input
    className="inp max-w-sm bg-white"
    value={v}
    onChange={(e) => set(e.target.value)}
    placeholder={ph}
    aria-label={ph}
  />
);

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
    </Modal>
  );
}

function BusForm({ bus, list, onSave, onClose }) {
  const [b, setB] = useState(bus),
    set = (k) => (e) =>
      setB({ ...b, [k]: k === "seats" ? +e.target.value : e.target.value });
  const dup = list.some((x) => x.plate === b.plate && x.id !== b.id);
  return (
    <Modal
      title={b.id ? `تعديل الحافلة ${b.id}` : "إضافة حافلة"}
      sub="يمكن ربط السائق من صفحة السائقين."
      onClose={onClose}
      footer={
        <>
          <Btn disabled={!b.plate || dup} onClick={() => onSave(b)}>
            حفظ الحافلة
          </Btn>
          <Btn variant="ghost" onClick={onClose}>
            إلغاء
          </Btn>
        </>
      }
    >
      <div className="space-y-3">
        <Field
          label="رقم اللوحة"
          error={
            dup && "رقم اللوحة موجود مسبقاً، تحقق منه أو راجع الحافلة الموجودة"
          }
        >
          <input
            className={`inp ${dup ? "border-red-400" : ""}`}
            value={b.plate}
            onChange={set("plate")}
            placeholder="412538"
          />
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="عدد المقاعد">
            <input
              type="number"
              min="10"
              className="inp"
              value={b.seats}
              onChange={set("seats")}
            />
          </Field>
          <Field label="الحالة">
            <select className="inp" value={b.status} onChange={set("status")}>
              {["أونلاين", "معطل", "احتياطي"].map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </Field>
        </div>
        <Field label="الخط">
          <select className="inp" value={b.line} onChange={set("line")}>
            <option>—</option>
            {lines.map((l) => (
              <option key={l.id}>{l.name}</option>
            ))}
          </select>
        </Field>
      </div>
    </Modal>
  );
}

export function Buses() {
  const [q, setQ] = useState(""),
    [f, setF] = useState("الكل"),
    [list, setList] = useState(defaultBuses),
    [edit, setEdit] = useState(null),
    [re, setRe] = useState(null),
    [msg, setMsg] = useState("");
  const rows = list.filter(
    (b) => (b.plate + b.line).includes(q) && (f === "الكل" || b.status === f),
  );
  const save = (b) => {
    setList((l) =>
      b.id
        ? l.map((x) => (x.id === b.id ? b : x))
        : [
            ...l,
            { ...b, id: Math.max(...l.map((x) => x.id)) + 1, driver: "—" },
          ],
    );
    setEdit(null);
  };
  return (
    <Page
      title="الحافلات"
      sub={`${list.length} حافلة · ${list.filter((b) => b.status === "أونلاين").length} أونلاين`}
      actions={
        <Btn
          onClick={() =>
            setEdit({ plate: "", seats: 45, line: "—", status: "احتياطي" })
          }
        >
          + إضافة حافلة
        </Btn>
      }
    >
      {msg && (
        <div
          role="status"
          className="mb-4 rounded-lg bg-lime px-4 py-3 text-sm font-bold"
        >
          {msg}
        </div>
      )}
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <Search v={q} set={setQ} ph="ابحث برقم الباص أو الخط..." />
        <Chips
          items={["الكل", "أونلاين", "معطل", "احتياطي"]}
          value={f}
          onChange={setF}
        />
      </div>
      {rows.length ? (
        <Table
          cols={["رقم", "اللوحة", "الخط", "المقاعد", "السائق", "الحالة", ""]}
          rows={rows}
          render={(b) => [
            b.id,
            `حمص ${b.plate}`,
            b.line,
            b.seats,
            b.driver,
            <Badge>{b.status}</Badge>,
            <span className="flex gap-3">
              <button
                className="font-semibold hover:underline"
                onClick={() => setEdit(b)}
              >
                تعديل
              </button>
              {b.status === "معطل" && (
                <button
                  className="font-semibold text-red-600 hover:underline"
                  onClick={() => setRe(b)}
                >
                  إعادة تعيين
                </button>
              )}
            </span>,
          ]}
        />
      ) : (
        <div className="rounded-xl border border-line bg-white">
          <Empty title="لا نتائج" text="جرّب تغيير كلمة البحث أو الفلتر." />
        </div>
      )}
      {edit && (
        <BusForm
          bus={edit}
          list={list}
          onSave={save}
          onClose={() => setEdit(null)}
        />
      )}
      {re && (
        <ReassignModal
          bus={re}
          onClose={() => setRe(null)}
          onDone={(m) => {
            setRe(null);
            setMsg(m);
          }}
        />
      )}
    </Page>
  );
}
