// src/pages/LineEdit.jsx
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Btn, Card, Field, Page } from "../components/ui";
import { MapView } from "../components/MapView";
import { tempLines, setTempLines, stops as defaultStops } from "../data";

export function LineEdit() {
  const { id } = useParams();
  const go = useNavigate();
  const isNew = id === "new";

  const existingLine = !isNew
    ? tempLines.find((l) => l.id === +id) || tempLines[0]
    : null;

  const lineId = isNew ? tempLines.length + 1 : existingLine.id;

  const [name, setName] = useState(isNew ? "" : existingLine.name);
  const [fare, setFare] = useState(isNew ? 1500 : existingLine.fare);
  const [st, setSt] = useState(
    isNew ? [] : existingLine.stopsList || defaultStops,
  );

  const [addingStop, setAddingStop] = useState(false);
  const [newStopName, setNewStopName] = useState("");
  const [showDeleteBanner, setShowDeleteBanner] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const move = (i, d) =>
    setSt((s) => {
      const n = [...s];
      const j = i + d;
      if (j < 0 || j >= n.length) return s;
      [n[i], n[j]] = [n[j], n[i]];
      return n;
    });

  const removeStop = (index) => {
    setSt((s) => s.filter((_, idx) => idx !== index));
  };

  const handleAddStop = () => {
    const trimmed = newStopName.trim();
    if (!trimmed) return;
    if (st.includes(trimmed)) {
      setErrorMsg("هذه المحطة مضافة مسبقاً في هذا الخط!");
      return;
    }
    setErrorMsg("");
    setSt((prev) => [...prev, trimmed]);
    setNewStopName("");
    setAddingStop(false);
  };

  const executeDelete = () => {
    const filtered = tempLines.filter((l) => l.id !== lineId);
    const reindexed = filtered.map((l, idx) => ({
      ...l,
      id: idx + 1,
    }));
    setTempLines(reindexed);
    go("/lines");
  };

  const handleSave = (targetStatus) => {
    if (!name.trim()) {
      setErrorMsg("يرجى إدخال اسم الخط أولاً قبل الحفظ.");
      return;
    }
    if (!fare || Number(fare) <= 0) {
      setErrorMsg("يرجى إدخال سعر تعرفة صحيح.");
      return;
    }
    setErrorMsg("");

    const updatedLineObj = {
      id: lineId,
      name: name.trim(),
      fare: Number(fare),
      stops: st.length,
      stopsList: st,
      buses: isNew ? 0 : existingLine.buses,
      status: targetStatus,
    };

    const updatedList = isNew
      ? [...tempLines, updatedLineObj]
      : tempLines.map((l) => (l.id === lineId ? updatedLineObj : l));

    const normalizedList = updatedList.map((l, idx) => ({
      ...l,
      id: idx + 1,
    }));

    setTempLines(normalizedList);
    go("/lines");
  };

  return (
    <Page
      title={isNew ? "إضافة خط جديد" : `تعديل خط: ${name || existingLine.name}`}
      sub={`رقم الخط #${lineId} · ${st.length} محطات`}
      actions={
        <>
          <Btn variant="lime" onClick={() => handleSave("منشور")}>
            نشر الخط
          </Btn>
          <Btn variant="ghost" onClick={() => handleSave("مسودة")}>
            حفظ كمسودة
          </Btn>
          {!isNew && (
            <Btn
              variant="ghost"
              className="text-slate-500 hover:border-amber-300 hover:bg-amber-50 hover:text-amber-800"
              onClick={() => setShowDeleteBanner(true)}
            >
              حذف الخط
            </Btn>
          )}
          <Btn variant="ghost" onClick={() => go("/lines")}>
            إلغاء
          </Btn>
        </>
      }
    >
      {showDeleteBanner && (
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-navy/20 bg-navy px-4 py-3 text-white shadow-sm">
          <div className="flex items-center gap-2.5 text-sm">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-lime/20 text-xs font-bold text-lime">
              !
            </span>
            <span>
              هل تريدين حذف خط{" "}
              <strong className="text-lime">
                «{name || existingLine?.name}»
              </strong>{" "}
              نهائياً؟
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
              onClick={() => setShowDeleteBanner(false)}
              className="rounded-lg border border-white/20 px-3.5 py-1.5 text-xs font-semibold text-white transition hover:bg-white/10"
            >
              تراجع
            </button>
          </div>
        </div>
      )}

      {errorMsg && (
        <div className="mb-4 flex items-center justify-between rounded-xl border border-amber-300 bg-amber-50 px-4 py-2.5 text-sm text-amber-900">
          <span>{errorMsg}</span>
          <button
            type="button"
            onClick={() => setErrorMsg("")}
            className="text-xs font-bold text-amber-700 hover:underline"
          >
            إغلاق
          </button>
        </div>
      )}

      <div className="grid gap-4 lg:grid-cols-[1fr_340px]">
        <Card title="مسار الخط">
          <MapView className="h-96" />
        </Card>

        <div className="space-y-4">
          <Card title="بيانات الخط ">
            <div className="space-y-3">
              <Field label="رقم الخط (تلقائي)">
                <input
                  className="inp bg-slate-50 text-slate-500"
                  value={lineId}
                  readOnly
                />
              </Field>
              <Field label="اسم الخط">
                <input
                  className="inp"
                  placeholder="مثال: كراجات - جامعة حمص"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </Field>
              <Field label="سعر التعرفة (ل.س)">
                <input
                  type="number"
                  min="0"
                  step="100"
                  className="inp"
                  placeholder="1500"
                  value={fare}
                  onChange={(e) => setFare(e.target.value)}
                />
              </Field>
            </div>
          </Card>

          <Card title={`المحطات بالترتيب · ${st.length}`}>
            {st.length === 0 ? (
              <p className="py-3 text-center text-xs text-slate-400">
                لا توجد محطات مضافة لهذا الخط بعد.
              </p>
            ) : (
              <ol className="space-y-2 text-sm">
                {st.map((s, i) => (
                  <li
                    key={`${s}-${i}`}
                    className="flex items-center justify-between rounded-lg border border-line px-3 py-2"
                  >
                    <span>
                      {i + 1}. {s}
                    </span>
                    <span className="flex items-center gap-1">
                      <button
                        type="button"
                        aria-label="أعلى"
                        onClick={() => move(i, -1)}
                        className="px-1 text-slate-400 hover:text-navy"
                      >
                        ↑
                      </button>
                      <button
                        type="button"
                        aria-label="أسفل"
                        onClick={() => move(i, 1)}
                        className="px-1 text-slate-400 hover:text-navy"
                      >
                        ↓
                      </button>
                      <button
                        type="button"
                        aria-label="حذف"
                        onClick={() => removeStop(i)}
                        className="mr-1 px-1 text-slate-400 hover:text-amber-700"
                        title="حذف المحطة"
                      >
                        ×
                      </button>
                    </span>
                  </li>
                ))}
              </ol>
            )}

            {addingStop ? (
              <div className="mt-3 space-y-2 rounded-lg border border-line bg-slate-50 p-2.5">
                <input
                  className="inp bg-white text-sm"
                  placeholder="اكتب اسم المحطة..."
                  value={newStopName}
                  onChange={(e) => setNewStopName(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleAddStop()}
                  autoFocus
                />
                <div className="flex gap-2">
                  <Btn
                    variant="lime"
                    className="flex-1 py-1.5 text-xs"
                    onClick={handleAddStop}
                  >
                    إضافة
                  </Btn>
                  <Btn
                    variant="ghost"
                    className="py-1.5 text-xs"
                    onClick={() => {
                      setAddingStop(false);
                      setNewStopName("");
                    }}
                  >
                    إلغاء
                  </Btn>
                </div>
              </div>
            ) : (
              <Btn
                variant="ghost"
                className="mt-3 w-full"
                onClick={() => setAddingStop(true)}
              >
                + إضافة محطة
              </Btn>
            )}
          </Card>
        </div>
      </div>
    </Page>
  );
}
