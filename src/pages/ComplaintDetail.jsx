// src/pages/ComplaintDetail.jsx
import { useNavigate, useParams } from "react-router-dom";
import { Btn, Card, Field, Table, Page } from "../components/ui";
import { tx, fmt } from "../data";

export function ComplaintDetail() {
  const { id } = useParams(),
    go = useNavigate();
  return (
    <Page
      title={`شكوى ${id} · خصم مكرر`}
      sub="مالية"
      actions={
        <>
          <Btn variant="lime" onClick={() => go("/complaints")}>
            قبول وإرجاع المبلغ
          </Btn>
          <Btn variant="ghost" onClick={() => go("/complaints")}>
            رفض مع ملاحظة
          </Btn>
        </>
      }
    >
      <div className="grid gap-4 lg:grid-cols-[1fr_320px]">
        <div className="space-y-4">
          <Card title="المعاملات المرتبطة بالرحلة">
            <Table
              cols={["المعاملة", "الوقت", "الخط", "المبلغ"]}
              rows={tx.slice(0, 2)}
              render={(t) => [t.id, t.time, t.line, `${fmt(t.amount)} ل.س`]}
            />
          </Card>
          <Card title="القرار">
            <Field label="ملاحظة للراكب">
              <textarea
                className="inp h-24"
                placeholder="تم رد المبلغ المخصوم مرتين إلى محفظتك."
              />
            </Field>
          </Card>
        </div>
        <Card title="تفاصيل الشكوى">
          <dl className="space-y-3 text-sm">
            <div>
              <dt className="text-xs text-slate-400">الراكب</dt>
              <dd className="font-bold">رنا الحسن</dd>
            </div>
            <div>
              <dt className="text-xs text-slate-400">الرحلة</dt>
              <dd>خط 5 · باص 17 · اليوم 9:40</dd>
            </div>
            <div>
              <dt className="text-xs text-slate-400">السائق</dt>
              <dd>خالد العلي</dd>
            </div>
          </dl>
        </Card>
      </div>
    </Page>
  );
}
