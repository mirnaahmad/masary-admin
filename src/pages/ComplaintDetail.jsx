// src/pages/ComplaintDetail.jsx
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Badge, Btn, Card, Field, Table, Page } from "../components/ui";
import { tempComplaints, setTempComplaints, tx, fmt } from "../data";

export function ComplaintDetail() {
  const { id } = useParams();
  const go = useNavigate();

  const complaint =
    tempComplaints.find((c) => String(c.id) === String(id)) ||
    tempComplaints[0];

  const isFinancial = complaint.cat === "مالية";
  const isClosed = complaint.status === "مغلقة";

  const [note, setNote] = useState(complaint.resolutionNote || "");
  const [errorMsg, setErrorMsg] = useState("");

  const handleDecision = (decisionType) => {
    // في حال الرفض، كتابة الملاحظة إجبارية لتوضيح السبب للراكب
    if (decisionType === "مرفوضة" && !note.trim()) {
      setErrorMsg("يرجى كتابة سبب الرفض في خانة الملاحظة للراكب قبل التأكيد.");
      return;
    }

    const defaultNote =
      decisionType === "مقبولة"
        ? isFinancial
          ? "تم التحقق من المعاملة ورد المبلغ المخصوم إلى محفظتك."
          : "تمت مراجعة الشكوى واتخاذ الإجراء اللازم مع السائق المعني."
        : note.trim();

    const finalNote = note.trim() || defaultNote;

    const updated = tempComplaints.map((c) =>
      String(c.id) === String(complaint.id)
        ? {
            ...c,
            status: "مغلقة",
            decision: decisionType,
            resolutionNote: finalNote,
          }
        : c,
    );

    setTempComplaints(updated);
    go("/complaints");
  };

  return (
    <Page
      title={`شكوى ${complaint.id} · ${complaint.type}`}
      sub={`${complaint.cat} · ${complaint.date}`}
      actions={
        isClosed ? (
          <Btn variant="ghost" onClick={() => go("/complaints")}>
            ← العودة للشكاوى
          </Btn>
        ) : (
          <>
            <Btn variant="lime" onClick={() => handleDecision("مقبولة")}>
              {isFinancial ? "قبول وإرجاع المبلغ" : "قبول ومعالجة الشكوى"}
            </Btn>
            <Btn
              variant="ghost"
              className="text-slate-600 hover:border-amber-300 hover:bg-amber-50 hover:text-amber-800"
              onClick={() => handleDecision("مرفوضة")}
            >
              رفض مع ملاحظة
            </Btn>
            <Btn variant="ghost" onClick={() => go("/complaints")}>
              رجوع
            </Btn>
          </>
        )
      }
    >
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

      <div className="grid gap-4 lg:grid-cols-[1fr_320px]">
        <div className="space-y-4">
          {/* نص الشكوى الوارد من الراكب */}
          <Card title="نص الشكوى المرسلة">
            <p className="text-sm leading-relaxed text-slate-700">
              {complaint.description}
            </p>
          </Card>

          {/* جدول المعاملات المالية يظهر فقط للشكاوى المالية */}
          {isFinancial && (
            <Card title="المعاملات المالية المرتبطة بالرحلة">
              <Table
                cols={["المعاملة", "الوقت", "الخط", "المبلغ"]}
                rows={tx.slice(0, 2)}
                render={(t) => [
                  <span className="font-mono text-xs">{t.id}</span>,
                  t.time,
                  t.line,
                  <b>{fmt(t.amount)} ل.س</b>,
                ]}
              />
            </Card>
          )}

          <Card
            title={isClosed ? "القرار المتخذ" : "اتخاذ القرار والرد على الراكب"}
          >
            {isClosed ? (
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <span className="text-slate-500">نتيجة المراجعة:</span>
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${
                      complaint.decision === "مرفوضة"
                        ? "bg-amber-100 text-amber-800"
                        : "bg-emerald-100 text-emerald-800"
                    }`}
                  >
                    {complaint.decision || "تمت المعالجة"}
                  </span>
                </div>
                <div className="rounded-lg bg-slate-50 p-3 text-slate-700">
                  <span className="mb-1 block text-xs font-semibold text-slate-400">
                    الرد المرسل للراكب:
                  </span>
                  {complaint.resolutionNote || "تم إغلاق الشكوى."}
                </div>
              </div>
            ) : (
              <Field label="ملاحظة / رد للراكب (إجبارية في حال الرفض)">
                <textarea
                  className="inp h-24"
                  value={note}
                  onChange={(e) => {
                    setNote(e.target.value);
                    if (errorMsg) setErrorMsg("");
                  }}
                  placeholder={
                    isFinancial
                      ? "مثال: تم التحقق ورد المبلغ المخصوم مرتين إلى محفظتك."
                      : "مثال: تم تنبيه السائق ومتابعة التزام الحافلات بمواعيد الانطلاق."
                  }
                />
              </Field>
            )}
          </Card>
        </div>

        <Card title="تفاصيل الشكوى">
          <dl className="space-y-3 text-sm">
            <div className="flex items-center justify-between">
              <dt className="text-xs text-slate-400">الحالة</dt>
              <dd>
                <Badge>{complaint.status}</Badge>
              </dd>
            </div>
            <div>
              <dt className="text-xs text-slate-400">الراكب</dt>
              <dd className="font-bold text-navy">{complaint.from}</dd>
            </div>
            <div>
              <dt className="text-xs text-slate-400">الرحلة والحافلة</dt>
              <dd>
                {complaint.line} · {complaint.bus} · {complaint.date}
              </dd>
            </div>
            <div>
              <dt className="text-xs text-slate-400">السائق المعني</dt>
              <dd>{complaint.driver}</dd>
            </div>
            {complaint.ref && (
              <div>
                <dt className="text-xs text-slate-400">
                  رقم المرجع / المعاملة
                </dt>
                <dd className="font-mono text-xs">{complaint.ref}</dd>
              </div>
            )}
          </dl>
        </Card>
      </div>
    </Page>
  );
}
