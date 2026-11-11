// src/pages/DriverNew.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Btn, Card, Field, Page } from "../components/ui";

export function DriverNew() {
  const go = useNavigate(),
    [done, setDone] = useState(false);
  return (
    <Page
      title="إضافة سائق"
      sub="السائقون · سائق جديد"
      actions={
        <>
          <Btn variant="ghost" onClick={() => go("/drivers")}>
            إلغاء
          </Btn>
          <Btn onClick={() => go("/drivers")}>حفظ وتوليد الحساب</Btn>
        </>
      }
    >
      <div className="grid gap-4 lg:grid-cols-[1fr_320px]">
        <div className="space-y-4">
          <Card title="البيانات الشخصية">
            <div className="grid grid-cols-2 gap-3">
              <Field label="الاسم">
                <input className="inp" />
              </Field>
              <Field label="رقم الهاتف">
                <input className="inp" placeholder="0933 555 341" />
              </Field>
              <Field label="رقم رخصة السواقة">
                <input className="inp" />
              </Field>
              <Field label="تاريخ انتهاء الشهادة">
                <input className="inp" type="date" />
              </Field>
            </div>
          </Card>
          <Card title="الربط بحافلة">
            <div className="grid grid-cols-2 gap-3">
              <Field label="الخط">
                <select className="inp">
                  <option>الكراجات – الجامعة</option>
                </select>
              </Field>
              <Field label="الحافلة">
                <select className="inp">
                  <option>باص 34 · حمص 433020</option>
                </select>
              </Field>
            </div>
          </Card>
        </div>
        <div className="rounded-xl bg-navy p-5 text-white">
          <h3 className="font-bold">توليد الحساب</h3>
          <p className="mt-1 text-xs text-slate-300">
            سيتم توليد بيانات دخول للسائق وعرضها لمرة واحدة.
          </p>
          {done ? (
            <div className="mt-4 space-y-2 text-sm">
              <div className="rounded-lg bg-navy-800 p-3">
                <small className="text-slate-400">اسم المستخدم</small>
                <div className="font-bold text-lime">driver.rami.34</div>
              </div>
              <div className="rounded-lg bg-navy-800 p-3">
                <small className="text-slate-400">كلمة المرور المؤقتة</small>
                <div className="font-bold text-lime">Ms-8K2p7</div>
              </div>
            </div>
          ) : (
            <Btn
              variant="lime"
              className="mt-4 w-full"
              onClick={() => setDone(true)}
            >
              نسخ البيانات
            </Btn>
          )}
        </div>
      </div>
    </Page>
  );
}
