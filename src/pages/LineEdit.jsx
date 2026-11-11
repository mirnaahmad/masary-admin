// src/pages/LineEdit.jsx
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Btn, Card, Field, Page } from "../components/ui";
import { MapView } from "../components/MapView";
import { lines, stops as defaultStops } from "../data";

export function LineEdit() {
  const { id } = useParams(),
    go = useNavigate();
  const line = lines.find((l) => l.id === +id) || lines[0];
  const [name, setName] = useState(line.name),
    [st, setSt] = useState(defaultStops);
  const move = (i, d) =>
    setSt((s) => {
      const n = [...s],
        j = i + d;
      if (j < 0 || j >= n.length) return s;
      [n[i], n[j]] = [n[j], n[i]];
      return n;
    });
  return (
    <Page
      title={`تعديل خط: ${line.name}`}
      sub={`${st.length} محطات`}
      actions={
        <>
          <Btn variant="lime" onClick={() => go("/lines")}>
            نشر الخط
          </Btn>
          <Btn variant="ghost" onClick={() => go("/lines")}>
            حفظ كمسودة
          </Btn>
        </>
      }
    >
      <div className="grid gap-4 lg:grid-cols-[1fr_340px]">
        <Card title="مسار الخط">
          <MapView className="h-96" />
        </Card>
        <div className="space-y-4">
          <Card title="بيانات الخط">
            <div className="space-y-3">
              <Field label="رقم الخط">
                <input className="inp" value={line.id} readOnly />
              </Field>
              <Field label="اسم الخط">
                <input
                  className="inp"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </Field>
            </div>
          </Card>
          <Card title={`المحطات بالترتيب · ${st.length}`}>
            <ol className="space-y-2 text-sm">
              {st.map((s, i) => (
                <li
                  key={s}
                  className="flex items-center justify-between rounded-lg border border-line px-3 py-2"
                >
                  <span>
                    {i + 1}. {s}
                  </span>
                  <span className="flex gap-1">
                    <button
                      aria-label="أعلى"
                      onClick={() => move(i, -1)}
                      className="px-1 text-slate-400 hover:text-navy"
                    >
                      ↑
                    </button>
                    <button
                      aria-label="أسفل"
                      onClick={() => move(i, 1)}
                      className="px-1 text-slate-400 hover:text-navy"
                    >
                      ↓
                    </button>
                  </span>
                </li>
              ))}
            </ol>
            <Btn variant="ghost" className="mt-3 w-full">
              + إضافة محطة
            </Btn>
          </Card>
        </div>
      </div>
    </Page>
  );
}
