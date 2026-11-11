// src/pages/Drivers.jsx
import { useState } from "react";
import { Link } from "react-router-dom";
import { Badge, Btn, Chips, Table, Page } from "../components/ui";
import { drivers } from "../data";

export function Drivers() {
  const [f, setF] = useState("الكل");
  const rows = drivers.filter((d) => f === "الكل" || d.status === f);
  return (
    <Page
      title="السائقون"
      sub={`${drivers.length} سائق`}
      actions={
        <Link to="/drivers/new">
          <Btn>+ إضافة سائق</Btn>
        </Link>
      }
    >
      <div className="mb-4 flex justify-end">
        <Chips items={["الكل", "بجولة", "أونلاين"]} value={f} onChange={setF} />
      </div>
      <Table
        cols={["السائق", "الهاتف", "اسم المستخدم", "الخط", "الباص", "الحالة"]}
        rows={rows}
        render={(d) => [
          <b>{d.name}</b>,
          d.phone,
          d.user,
          d.line,
          d.bus,
          <Badge>{d.status}</Badge>,
        ]}
      />
    </Page>
  );
}
