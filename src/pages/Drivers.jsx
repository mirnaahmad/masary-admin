// src/pages/Drivers.jsx
import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { Btn, Chips, Empty, Table, Modal, Field, Page } from "../components/ui";
import {
  tempDrivers,
  setTempDrivers,
  tempLines,
  tempBuses,
  setTempBuses,
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

// نافذة نقل السائق من خط لخط أو حافلة لحافلة
function TransferDriverModal({ driver, onClose, onSave }) {
  const currentBusObj = tempBuses.find((b) => b.driver === driver.name);

  const [selectedLine, setSelectedLine] = useState(driver.line || "—");
  const [selectedBusId, setSelectedBusId] = useState(
    currentBusObj ? String(currentBusObj.id) : "",
  );

  // الحافلات المتاحة (إما حافلته الحالية، أو حافلة بدون سائق، أو تابعة لنفس الخط)
  const busesOptions = tempBuses.filter(
    (b) =>
      String(b.id) === String(selectedBusId) ||
      selectedLine === "—" ||
      b.line === selectedLine ||
      b.line === "—",
  );

  const handleConfirm = () => {
    onSave(driver, selectedLine, selectedBusId);
  };

  return (
    <Modal
      title={`نقل / تعيين السائق: ${driver.name}`}
      sub={`الموقع الحالي: ${driver.line} (${driver.bus})`}
      onClose={onClose}
      footer={
        <>
          <Btn variant="lime" onClick={handleConfirm}>
            تأكيد النقل
          </Btn>
          <Btn variant="ghost" onClick={onClose}>
            إلغاء
          </Btn>
        </>
      }
    >
      <div className="space-y-3">
        <Field label="الخط الجديد">
          <select
            className="inp"
            value={selectedLine}
            onChange={(e) => {
              setSelectedLine(e.target.value);
              setSelectedBusId("");
            }}
          >
            <option value="—">— بدون خط (فك الارتباط) —</option>
            {tempLines.map((l) => (
              <option key={l.id} value={l.name}>
                {l.name}
              </option>
            ))}
          </select>
        </Field>

        <Field label="الحافلة الجديدة">
          <select
            className="inp"
            value={selectedBusId}
            onChange={(e) => setSelectedBusId(e.target.value)}
          >
            <option value="">— بدون حافلة —</option>
            {busesOptions.map((b) => (
              <option key={b.id} value={b.id}>
                باص #{b.id} · حمص {b.plate} ({b.status}
                {b.driver && b.driver !== "—" && b.driver !== driver.name
                  ? ` · يقوده حالياً ${b.driver}`
                  : ""}
                )
              </option>
            ))}
          </select>
        </Field>

        <p className="rounded-lg bg-slate-50 p-2.5 text-xs text-slate-500">
          ملاحظة: نقل السائق سيحدّث ارتباطه في جدول الحافلات تلقائياً، وتبقى
          حالته «أونلاين» أو «أوفلاين» بناءً على تفعيل مشاركة موقعه من تطبيقه.
        </p>
      </div>
    </Modal>
  );
}

export function Drivers() {
  const [q, setQ] = useState("");
  const [f, setF] = useState("الكل");
  const [list, setList] = useState(tempDrivers);
  const [transferTarget, setTransferTarget] = useState(null);
  const [confirmDeactivate, setConfirmDeactivate] = useState(null);
  const [msg, setMsg] = useState("");

  const rows = useMemo(
    () =>
      list.filter(
        (d) =>
          (d.name + d.phone + d.user + d.line)
            .toLowerCase()
            .includes(q.trim().toLowerCase()) &&
          (f === "الكل" || d.status === f),
      ),
    [list, q, f],
  );

  // محاكاة تبديل حالة مشاركة الموقع (GPS) بين أونلاين وأوفلاين للتجربة
  const toggleLiveStatus = (driver) => {
    const nextStatus = driver.status === "أونلاين" ? "أوفلاين" : "أونلاين";
    const updated = list.map((d) =>
      d.id === driver.id ? { ...d, status: nextStatus } : d,
    );
    setList(updated);
    setTempDrivers(updated);
  };

  // تنفيذ نقل السائق إلى خط / حافلة جديدة
  const handleTransferSave = (driver, newLine, newBusId) => {
    const targetBus = tempBuses.find((b) => String(b.id) === String(newBusId));
    const newBusLabel = targetBus
      ? `باص ${targetBus.id} · ${targetBus.plate}`
      : "—";

    // 1. تحديث قائمة السائقين
    const updatedDrivers = list.map((d) =>
      d.id === driver.id ? { ...d, line: newLine, bus: newBusLabel } : d,
    );
    setList(updatedDrivers);
    setTempDrivers(updatedDrivers);

    // 2. تحديث قائمة الحافلات (فك السائق عن حافلته القديمة وربطه بالجديدة)
    const updatedBuses = tempBuses.map((b) => {
      if (targetBus && b.id === targetBus.id) {
        return {
          ...b,
          driver: driver.name,
          line: newLine !== "—" ? newLine : b.line,
        };
      }
      if (b.driver === driver.name) {
        return { ...b, driver: "—" };
      }
      return b;
    });
    setTempBuses(updatedBuses);

    setTransferTarget(null);
    setMsg(`تم نقل السائق «${driver.name}» وتحديث بيانات الحافلة والخط بنجاح.`);
  };

  // إيقاف حساب السائق
  const executeDeactivate = () => {
    if (!confirmDeactivate) return;
    const filtered = list.filter((d) => d.id !== confirmDeactivate.id);
    const reindexed = filtered.map((d, idx) => ({
      ...d,
      id: idx + 1,
    }));
    setList(reindexed);
    setTempDrivers(reindexed);

    const updatedBuses = tempBuses.map((b) =>
      b.driver === confirmDeactivate.name ? { ...b, driver: "—" } : b,
    );
    setTempBuses(updatedBuses);
    setConfirmDeactivate(null);
  };

  const isFiltering = q.trim() !== "" || f !== "الكل";

  return (
    <Page
      title="السائقون"
      sub={`${list.length} سائق · ${
        list.filter((d) => d.status === "أونلاين").length
      } يشارك موقعه الآن`}
      actions={
        <Link to="/drivers/new">
          <Btn>+ إضافة سائق</Btn>
        </Link>
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
            className="rounded-lg px-2 py-0.5 text-base font-extrabold text-navy/70 hover:bg-navy/10 hover:text-navy"
          >
            ×
          </button>
        </div>
      )}

      {/* شريط تأكيد الإيقاف */}
      {confirmDeactivate && (
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-navy/20 bg-navy px-4 py-3 text-white shadow-sm">
          <div className="flex items-center gap-2.5 text-sm">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-lime/20 text-xs font-bold text-lime">
              !
            </span>
            <span>
              هل تريدين إيقاف حساب السائق{" "}
              <strong className="text-lime">«{confirmDeactivate.name}»</strong>{" "}
              وإزالته من القائمة؟
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={executeDeactivate}
              className="rounded-lg bg-lime px-3.5 py-1.5 text-xs font-bold text-navy transition hover:opacity-90"
            >
              تأكيد الإيقاف
            </button>
            <button
              type="button"
              onClick={() => setConfirmDeactivate(null)}
              className="rounded-lg border border-white/20 px-3.5 py-1.5 text-xs font-semibold text-white transition hover:bg-white/10"
            >
              تراجع
            </button>
          </div>
        </div>
      )}

      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <Search v={q} set={setQ} ph="ابحث باسم السائق أو الهاتف أو الخط..." />
        <Chips
          items={["الكل", "أونلاين", "أوفلاين"]}
          value={f}
          onChange={setF}
        />
      </div>

      {rows.length > 0 ? (
        <Table
          cols={[
            "#",
            "السائق",
            "الهاتف",
            "اسم المستخدم",
            "الخط",
            "الباص",
            "البث المباشر",
            "",
          ]}
          rows={rows}
          render={(d) => [
            d.id,
            <b>{d.name}</b>,
            d.phone,
            <span className="font-mono text-xs text-slate-600">{d.user}</span>,
            d.line,
            d.bus,
            <button
              type="button"
              onClick={() => toggleLiveStatus(d)}
              title="انقر لمحاكاة فتح/إغلاق موقع السائق للركاب"
              className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-bold transition ${
                d.status === "أونلاين"
                  ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200"
                  : "bg-slate-100 text-slate-500 ring-1 ring-slate-200"
              }`}
            >
              <span
                className={`h-2 w-2 rounded-full ${
                  d.status === "أونلاين"
                    ? "animate-pulse bg-emerald-500"
                    : "bg-slate-400"
                }`}
              />
              {d.status}
            </button>,
            <div className="flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setTransferTarget(d)}
                className="rounded-lg border border-line bg-slate-50 px-3 py-1 text-xs font-semibold text-navy transition hover:border-navy hover:bg-navy hover:text-white"
              >
                نقل
              </button>
              <button
                type="button"
                onClick={() => setConfirmDeactivate(d)}
                className="rounded-lg border border-line bg-white px-2.5 py-1 text-xs font-medium text-slate-500 transition hover:border-amber-300 hover:bg-amber-50 hover:text-amber-800"
              >
                إيقاف
              </button>
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
              title="لا يوجد سائقون مسجلون"
              text="ابدأ بإضافة أول سائق وتوليد بيانات الدخول الخاصة به."
              action={
                <Link to="/drivers/new">
                  <Btn>+ إضافة أول سائق</Btn>
                </Link>
              }
            />
          )}
        </div>
      )}

      {transferTarget && (
        <TransferDriverModal
          driver={transferTarget}
          onClose={() => setTransferTarget(null)}
          onSave={handleTransferSave}
        />
      )}
    </Page>
  );
}
