// src/pages/Buses.jsx
import { useState, useMemo } from "react";
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
import {
  tempBuses,
  setTempBuses,
  tempLines,
  drivers as defaultDrivers,
} from "../data";

const Search = ({ v, set, ph }) => (
  <input
    className="inp max-w-sm bg-white"
    value={v}
    onChange={(e) => set(e.target.value)}
    placeholder={ph}
    aria-label={ph}
  />
);

function ReassignModal({ bus, list, onClose, onDone }) {
  const availableBuses = list.filter(
    (x) => x.id !== bus.id && x.status === "احتياطي",
  );

  const [pickId, setPickId] = useState(
    availableBuses.length > 0 ? availableBuses[0].id : null,
  );
  const [transferDriver, setTransferDriver] = useState(true);
  const [busy, setBusy] = useState(false);

  const confirm = () => {
    if (!pickId) return;
    setBusy(true);
    onDone(pickId, transferDriver);
  };

  return (
    <Modal
      title={`إعادة تعيين: الباص #${bus.id} معطل`}
      sub={`خط ${bus.line} · اختر حافلة احتياطية بديلة لمتابعة الرحلات`}
      onClose={onClose}
      footer={
        <>
          <Btn variant="lime" disabled={busy || !pickId} onClick={confirm}>
            {busy ? "جارٍ التأكيد..." : "تأكيد إعادة التعيين"}
          </Btn>
          <Btn variant="ghost" onClick={onClose}>
            إلغاء
          </Btn>
        </>
      }
    >
      {bus.driver && bus.driver !== "—" && (
        <label className="mb-3 flex cursor-pointer items-center gap-2 rounded-lg bg-slate-50 p-2.5 text-sm">
          <input
            type="checkbox"
            checked={transferDriver}
            onChange={(e) => setTransferDriver(e.target.checked)}
            className="accent-navy"
          />
          <span>
            نقل السائق <strong>{bus.driver}</strong> إلى الحافلة البديلة
          </span>
        </label>
      )}

      {availableBuses.length > 0 ? (
        <div className="space-y-2">
          <p className="text-xs font-semibold text-slate-500">
            الحافلات الاحتياطية المتاحة ({availableBuses.length}):
          </p>
          {availableBuses.map((spareBus) => (
            <label
              key={spareBus.id}
              className={`flex cursor-pointer items-center justify-between rounded-lg border p-3 transition ${
                pickId === spareBus.id
                  ? "border-navy bg-lime/30"
                  : "border-line hover:bg-slate-50"
              }`}
            >
              <span>
                <b className="block text-sm text-navy">
                  باص #{spareBus.id} · لوحة حمص {spareBus.plate}
                </b>
                <small className="text-slate-500">
                  {spareBus.seats} مقعد · السائق الحالي:{" "}
                  {spareBus.driver || "—"}
                </small>
              </span>
              <input
                type="radio"
                name="spare"
                checked={pickId === spareBus.id}
                onChange={() => setPickId(spareBus.id)}
                className="accent-navy"
              />
            </label>
          ))}
        </div>
      ) : (
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-center text-sm text-amber-800">
          لا توجد حافلات بحالة <strong>"احتياطي"</strong> حالياً في الأسطول.
          يمكنك إضافة حافلة احتياطية أو تغيير حالة إحدى الحافلات المتوقفة.
        </div>
      )}
    </Modal>
  );
}

function BusForm({ bus, list, onSave, onClose }) {
  const [b, setB] = useState({
    ...bus,
    driver: bus.driver || "—",
    line: bus.line || "—",
  });

  const set = (k) => (e) =>
    setB({ ...b, [k]: k === "seats" ? +e.target.value : e.target.value });

  const dup = list.some(
    (x) => x.plate.trim() === b.plate.trim() && x.id !== b.id,
  );

  // جلب أسماء السائقين المتاحين من data.js
  const driverNames = defaultDrivers ? defaultDrivers.map((d) => d.name) : [];

  return (
    <Modal
      title={b.id ? `تعديل الحافلة #${b.id}` : "إضافة حافلة جديدة"}
      sub="يمكن تعيين السائق هنا مباشرة أو تعديله لاحقاً من صفحة السائقين."
      onClose={onClose}
      footer={
        <>
          <Btn
            variant="lime"
            disabled={!b.plate.trim() || dup}
            onClick={() => onSave(b)}
          >
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
            <option value="—">— بدون خط محدد —</option>
            {tempLines.map((l) => (
              <option key={l.id} value={l.name}>
                {l.name}
              </option>
            ))}
          </select>
        </Field>

        <Field label="السائق المعين">
          <select className="inp" value={b.driver} onChange={set("driver")}>
            <option value="—">— بدون سائق معين —</option>
            {driverNames.map((name) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </select>
        </Field>
      </div>
    </Modal>
  );
}

export function Buses() {
  const [q, setQ] = useState("");
  const [f, setF] = useState("الكل");
  const [list, setList] = useState(tempBuses);
  const [edit, setEdit] = useState(null);
  const [re, setRe] = useState(null);
  const [msg, setMsg] = useState("");
  const [confirmDelete, setConfirmDelete] = useState(null);

  const rows = useMemo(
    () =>
      list.filter(
        (b) =>
          (String(b.id) + b.plate + b.line + b.driver)
            .toLowerCase()
            .includes(q.trim().toLowerCase()) &&
          (f === "الكل" || b.status === f),
      ),
    [list, q, f],
  );

  const save = (b) => {
    const cleanBus = {
      ...b,
      plate: b.plate.trim(),
      driver: b.driver || "—",
      line: b.line || "—",
    };

    const updated = cleanBus.id
      ? list.map((x) => (x.id === cleanBus.id ? cleanBus : x))
      : [...list, { ...cleanBus, id: list.length + 1 }];

    const reindexed = updated.map((item, idx) => ({
      ...item,
      id: idx + 1,
    }));

    setList(reindexed);
    setTempBuses(reindexed);
    setEdit(null);
    setMsg(
      cleanBus.id
        ? `تم حفظ تعديلات الحافلة #${cleanBus.id} بنجاح`
        : `تمت إضافة الحافلة الجديدة بنجاح`,
    );
  };

  const executeDelete = () => {
    if (!confirmDelete) return;
    const filtered = list.filter((b) => b.id !== confirmDelete.id);
    const reindexed = filtered.map((item, idx) => ({
      ...item,
      id: idx + 1,
    }));
    setList(reindexed);
    setTempBuses(reindexed);
    setConfirmDelete(null);
  };

  const isFiltering = q.trim() !== "" || f !== "الكل";

  return (
    <Page
      title="الحافلات"
      sub={`${list.length} حافلة · ${
        list.filter((b) => b.status === "أونلاين").length
      } أونلاين`}
      actions={
        <Btn
          onClick={() =>
            setEdit({
              plate: "",
              seats: 45,
              line: "—",
              driver: "—",
              status: "احتياطي",
            })
          }
        >
          + إضافة حافلة
        </Btn>
      }
    >
      {msg && (
        <div
          role="status"
          className="mb-4 flex items-center justify-between rounded-xl bg-lime px-4 py-3 text-sm font-bold text-navy shadow-sm"
        >
          <span>{msg}</span>
          <button
            type="button"
            onClick={() => setMsg("")}
            aria-label="إغلاق الإشعار"
            className="rounded-lg px-2 py-0.5 text-base font-extrabold text-navy/70 transition hover:bg-navy/10 hover:text-navy"
          >
            ×
          </button>
        </div>
      )}

      {confirmDelete && (
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-navy/20 bg-navy px-4 py-3 text-white shadow-sm">
          <div className="flex items-center gap-2.5 text-sm">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-lime/20 text-xs font-bold text-lime">
              !
            </span>
            <span>
              هل تريدين حذف الحافلة{" "}
              <strong className="text-lime">
                #{confirmDelete.id} (حمص {confirmDelete.plate})
              </strong>
              ؟
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
        <Search v={q} set={setQ} ph="ابحث برقم الباص أو اللوحة أو الخط..." />
        <Chips
          items={["الكل", "أونلاين", "معطل", "احتياطي"]}
          value={f}
          onChange={setF}
        />
      </div>

      {rows.length > 0 ? (
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
            <div className="flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setEdit(b)}
                className="rounded-lg border border-line bg-slate-50 px-3 py-1 text-xs font-semibold text-navy transition hover:border-navy hover:bg-navy hover:text-white"
              >
                تعديل
              </button>
              <button
                type="button"
                onClick={() => setConfirmDelete(b)}
                className="rounded-lg border border-line bg-white px-2.5 py-1 text-xs font-medium text-slate-500 transition hover:border-amber-300 hover:bg-amber-50 hover:text-amber-800"
              >
                حذف
              </button>
              {b.status === "معطل" && (
                <button
                  type="button"
                  onClick={() => setRe(b)}
                  className="rounded-lg border border-red-200 bg-red-50 px-2.5 py-1 text-xs font-semibold text-red-600 transition hover:bg-red-600 hover:text-white"
                >
                  إعادة تعيين
                </button>
              )}
            </div>,
          ]}
        />
      ) : (
        <div className="rounded-xl border border-line bg-white">
          {isFiltering ? (
            <Empty
              title="لا نتائج مطابقة"
              text="جرّب تغيير كلمة البحث أو الفلتر المحدد."
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
              title="ما في حافلات مضافة لسا"
              text="ابدأ بإضافة أول حافلة للأسطول وتعيين خطها وسائقها."
              action={
                <Btn
                  onClick={() =>
                    setEdit({
                      plate: "",
                      seats: 45,
                      line: "—",
                      driver: "—",
                      status: "احتياطي",
                    })
                  }
                >
                  + إضافة أول حافلة
                </Btn>
              }
            />
          )}
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
          list={list}
          onClose={() => setRe(null)}
          onDone={(spareBusId, transferDriver) => {
            const targetBus = list.find((x) => x.id === spareBusId);
            const movedDriver =
              transferDriver && re.driver && re.driver !== "—"
                ? re.driver
                : targetBus?.driver || "—";

            const updated = list.map((item) => {
              // 1. الحافلة المعطلة: تُزال من الخط ويُنقل سائقها إذا تم تحديد الخيار
              if (item.id === re.id) {
                return {
                  ...item,
                  line: "—",
                  driver: transferDriver ? "—" : item.driver,
                };
              }
              // 2. الحافلة البديلة: تصبح "أونلاين"، تأخذ نفس الخط، وتستلم السائق
              if (item.id === spareBusId) {
                return {
                  ...item,
                  status: "أونلاين",
                  line: re.line,
                  driver: movedDriver,
                };
              }
              return item;
            });

            setList(updated);
            setTempBuses(updated);
            setRe(null);
            setMsg(
              `تم تحويل خط "${re.line}" إلى الحافلة #${spareBusId} وتفعيلها أونلاين بنجاح.`,
            );
          }}
        />
      )}
    </Page>
  );
}
