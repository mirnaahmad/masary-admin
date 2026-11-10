import { useState, useMemo } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { Badge, Btn, Card, Field, Chips, Empty, Table, Modal, Page, MapView } from './ui'
import { lines, stops, buses, drivers, complaints, tx, byLine, fmt } from './data'

const Search = ({ v, set, ph }) => <input className="inp max-w-sm bg-white" value={v} onChange={(e) => set(e.target.value)} placeholder={ph} aria-label={ph} />
const Link2 = ({ to, children }) => <Link to={to} className="font-semibold text-navy underline-offset-4 hover:underline">{children}</Link>

export function Login() {
  const go = useNavigate()
  const [u, setU] = useState('admin.homs'), [p, setP] = useState(''), [err, setErr] = useState('')
  const submit = (e) => { e.preventDefault(); p.length < 4 ? setErr('كلمة المرور قصيرة، أدخل 4 أحرف على الأقل') : go('/') }
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="flex flex-col justify-center bg-navy p-16 text-white">
        <div className="mb-3 text-4xl font-extrabold">مساري <span className="text-lime">MASARY</span></div>
        <h2 className="text-2xl font-bold">طرّبك.. بوقتك</h2>
        <p className="mt-3 max-w-sm text-sm text-slate-300">لوحة إدارة الخطوط والحافلات والسائقين لمدينة حمص، تابع الشكاوى والتقارير المالية في مكان واحد.</p></div>
      <form onSubmit={submit} className="m-auto w-full max-w-sm space-y-4 p-8">
        <div><h1 className="text-xl font-extrabold">تسجيل الدخول</h1><p className="text-xs text-slate-400">للموظفين المعتمدين من مديرية النقل</p></div>
        <Field label="اسم المستخدم"><input className="inp" value={u} onChange={(e) => setU(e.target.value)} /></Field>
        <Field label="كلمة المرور" error={err}><input type="password" className="inp" value={p} onChange={(e) => setP(e.target.value)} /></Field>
        <Btn className="w-full py-3">تسجيل الدخول</Btn></form></div>
  )
}

export function Dashboard() {
  const [open, setOpen] = useState(false), [pick, setPick] = useState(0), [sent, setSent] = useState(false)
  const stats = [['باصات شغالة', '18 / 24', true], ['ركاب اليوم', '3,420'], ['إيرادات اليوم', '8,550,000'], ['شكاوى جديدة', '3']]
  const opts = [['باص 31 · احتياطي', 'الموقع: الكراجات · بعد 12 دقيقة'], ['باص 33 · احتياطي', 'الموقع: الإنشاءات · بعد 15 دقيقة'], ['باص 7 · خط الوعر – الساعة', 'أقرب باص متاح حالياً']]
  return (
    <Page title="الرئيسية" sub="الأربعاء 4 تشرين الثاني · تحديث مباشر" actions={<Btn variant="ghost">عرض كل الخطوط</Btn>}>
      {sent && <div className="mb-4 rounded-lg bg-lime px-4 py-3 text-sm font-bold">تم إرسال الباص الإضافي إلى خط الكراجات – الجامعة</div>}
      <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">{stats.map(([l, v, d]) => (
        <div key={l} className={`rounded-xl border p-5 ${d ? 'border-navy bg-navy text-white' : 'border-line bg-white'}`}>
          <div className={`text-xs ${d ? 'text-slate-300' : 'text-slate-400'}`}>{l}</div><div className="mt-1 text-3xl font-extrabold">{v}</div></div>))}</div>
      <div className="grid gap-4 lg:grid-cols-[1fr_340px]">
        <Card title="الخريطة الحية"><MapView className="h-80" /></Card>
        <Card title="التنبيهات"><ul className="space-y-3 text-sm">
          <li className="rounded-lg border border-line p-3"><Badge tone="red">ازدحام</Badge><p className="mt-2 font-semibold">خط الكراجات – الجامعة مغلق بالكامل</p>
            <Btn variant="lime" className="mt-2 w-full" onClick={() => setOpen(true)}>إرسال باص إضافي</Btn></li>
          <li className="rounded-lg border border-line p-3"><Badge tone="red">معطل</Badge><p className="mt-2">باص 9 معطل · الركاب يحتاجون بديلاً</p></li>
          <li className="rounded-lg border border-line p-3"><Badge tone="navy">شكوى</Badge><p className="mt-2">شكوى خصم مكرر من: رنا الحسن</p></li></ul></Card></div>
      {open && <Modal title="إرسال باص إضافي" sub="خط الكراجات – الجامعة · المقاعد المتاحة قليلة" onClose={() => setOpen(false)}
        footer={<><Btn onClick={() => { setOpen(false); setSent(true) }}>إرسال الباص</Btn><Btn variant="ghost" onClick={() => setOpen(false)}>إلغاء</Btn></>}>
        <div className="space-y-2">{opts.map(([t, s], i) => (
          <label key={t} className={`flex cursor-pointer items-center justify-between rounded-lg border p-3 ${pick === i ? 'border-navy bg-lime/30' : 'border-line'}`}>
            <span><b className="block text-sm">{t}</b><small className="text-slate-500">{s}</small></span>
            <input type="radio" name="bus" checked={pick === i} onChange={() => setPick(i)} className="accent-navy" /></label>))}</div></Modal>}
    </Page>
  )
}

export function Lines() {
  const [q, setQ] = useState(''), [f, setF] = useState('الكل')
  const rows = useMemo(() => lines.filter((l) => l.name.includes(q) && (f === 'الكل' || l.status === f)), [q, f])
  return (
    <Page title="الخطوط والمحطات" sub={`${lines.length} خطوط`} actions={<Btn>+ خط جديد</Btn>}>
      <div className="mb-4 flex items-center justify-between"><Search v={q} set={setQ} ph="ابحث باسم الخط أو المحطة..." /><Chips items={['الكل', 'منشور', 'مسودة']} value={f} onChange={setF} /></div>
      {rows.length ? <Table cols={['رقم', 'الخط', 'المحطات', 'الباصات', 'الحالة', '']} rows={rows}
        render={(l) => [l.id, l.name, l.stops, l.buses, <Badge>{l.status}</Badge>, <Link2 to={`/lines/${l.id}`}>{l.status === 'مسودة' ? 'تكملة' : 'تعديل'}</Link2>]} />
        : <div className="rounded-xl border border-line bg-white"><Empty title="ما في خطوط لسا" text="ابدأ بإضافة أول خط: ارسم مساره على الخريطة وحدد محطاته بالترتيب." action={<Btn>+ إضافة أول خط</Btn>} /></div>}
    </Page>
  )
}

export function LineEdit() {
  const { id } = useParams(), go = useNavigate()
  const line = lines.find((l) => l.id === +id) || lines[0]
  const [name, setName] = useState(line.name), [st, setSt] = useState(stops)
  const move = (i, d) => setSt((s) => { const n = [...s], j = i + d; if (j < 0 || j >= n.length) return s;[n[i], n[j]] = [n[j], n[i]]; return n })
  return (
    <Page title={`تعديل خط: ${line.name}`} sub={`${st.length} محطات`} actions={<><Btn variant="lime" onClick={() => go('/lines')}>نشر الخط</Btn><Btn variant="ghost" onClick={() => go('/lines')}>حفظ كمسودة</Btn></>}>
      <div className="grid gap-4 lg:grid-cols-[1fr_340px]">
        <Card title="مسار الخط"><MapView className="h-96" /></Card>
        <div className="space-y-4">
          <Card title="بيانات الخط"><div className="space-y-3"><Field label="رقم الخط"><input className="inp" value={line.id} readOnly /></Field>
            <Field label="اسم الخط"><input className="inp" value={name} onChange={(e) => setName(e.target.value)} /></Field></div></Card>
          <Card title={`المحطات بالترتيب · ${st.length}`}><ol className="space-y-2 text-sm">{st.map((s, i) => (
            <li key={s} className="flex items-center justify-between rounded-lg border border-line px-3 py-2"><span>{i + 1}. {s}</span>
              <span className="flex gap-1"><button aria-label="أعلى" onClick={() => move(i, -1)} className="px-1 text-slate-400 hover:text-navy">↑</button><button aria-label="أسفل" onClick={() => move(i, 1)} className="px-1 text-slate-400 hover:text-navy">↓</button></span></li>))}</ol>
            <Btn variant="ghost" className="mt-3 w-full">+ إضافة محطة</Btn></Card></div></div>
    </Page>
  )
}

export function Buses() {
  const [q, setQ] = useState(''), [f, setF] = useState('الكل'), [add, setAdd] = useState(false), [plate, setPlate] = useState(''), [list, setList] = useState(buses)
  const dup = list.some((b) => b.plate === plate)
  const rows = list.filter((b) => (b.plate + b.line).includes(q) && (f === 'الكل' || b.status === f))
  return (
    <Page title="الحافلات" sub={`${list.length} حافلة · ${list.filter((b) => b.status === 'أونلاين').length} أونلاين`} actions={<Btn onClick={() => setAdd(true)}>+ إضافة حافلة</Btn>}>
      <div className="mb-4 flex items-center justify-between"><Search v={q} set={setQ} ph="ابحث برقم الباص أو الخط..." /><Chips items={['الكل', 'أونلاين', 'معطل', 'احتياطي']} value={f} onChange={setF} /></div>
      <Table cols={['رقم', 'اللوحة', 'الخط', 'المقاعد', 'السائق', 'الحالة']} rows={rows}
        render={(b) => [b.id, `حمص ${b.plate}`, b.line, b.seats, b.driver, <Badge>{b.status}</Badge>]} />
      {add && <Modal title="إضافة حافلة" sub="اربطها بخط وسائق لاحقاً." onClose={() => setAdd(false)}
        footer={<><Btn disabled={!plate || dup} onClick={() => { setList([...list, { id: list.length + 40, plate, line: '—', seats: 45, driver: '—', status: 'احتياطي' }]); setPlate(''); setAdd(false) }}>حفظ الحافلة</Btn><Btn variant="ghost" onClick={() => setAdd(false)}>إلغاء</Btn></>}>
        <div className="space-y-3"><Field label="رقم اللوحة" error={dup && 'رقم اللوحة موجود مسبقاً، تحقق منه أو راجع الحافلة الموجودة'}>
          <input className={`inp ${dup ? 'border-red-400' : ''}`} value={plate} onChange={(e) => setPlate(e.target.value)} placeholder="412538" /></Field></div></Modal>}
    </Page>
  )
}

export function Drivers() {
  const [f, setF] = useState('الكل')
  const rows = drivers.filter((d) => f === 'الكل' || d.status === f)
  return (
    <Page title="السائقون" sub={`${drivers.length} سائق`} actions={<Link to="/drivers/new"><Btn>+ إضافة سائق</Btn></Link>}>
      <div className="mb-4 flex justify-end"><Chips items={['الكل', 'بجولة', 'أونلاين']} value={f} onChange={setF} /></div>
      <Table cols={['السائق', 'الهاتف', 'اسم المستخدم', 'الخط', 'الباص', 'الحالة']} rows={rows}
        render={(d) => [<b>{d.name}</b>, d.phone, d.user, d.line, d.bus, <Badge>{d.status}</Badge>]} />
    </Page>
  )
}

export function DriverNew() {
  const go = useNavigate(), [done, setDone] = useState(false)
  return (
    <Page title="إضافة سائق" sub="السائقون · سائق جديد" actions={<><Btn variant="ghost" onClick={() => go('/drivers')}>إلغاء</Btn><Btn onClick={() => go('/drivers')}>حفظ وتوليد الحساب</Btn></>}>
      <div className="grid gap-4 lg:grid-cols-[1fr_320px]">
        <div className="space-y-4">
          <Card title="البيانات الشخصية"><div className="grid grid-cols-2 gap-3"><Field label="الاسم"><input className="inp" /></Field><Field label="رقم الهاتف"><input className="inp" placeholder="0933 555 341" /></Field>
            <Field label="رقم رخصة السواقة"><input className="inp" /></Field><Field label="تاريخ انتهاء الشهادة"><input className="inp" type="date" /></Field></div></Card>
          <Card title="الربط بحافلة"><div className="grid grid-cols-2 gap-3"><Field label="الخط"><select className="inp"><option>الكراجات – الجامعة</option></select></Field>
            <Field label="الحافلة"><select className="inp"><option>باص 34 · حمص 433020</option></select></Field></div></Card></div>
        <div className="rounded-xl bg-navy p-5 text-white"><h3 className="font-bold">توليد الحساب</h3>
          <p className="mt-1 text-xs text-slate-300">سيتم توليد بيانات دخول للسائق وعرضها لمرة واحدة.</p>
          {done ? <div className="mt-4 space-y-2 text-sm"><div className="rounded-lg bg-navy-800 p-3"><small className="text-slate-400">اسم المستخدم</small><div className="font-bold text-lime">driver.rami.34</div></div>
            <div className="rounded-lg bg-navy-800 p-3"><small className="text-slate-400">كلمة المرور المؤقتة</small><div className="font-bold text-lime">Ms-8K2p7</div></div></div>
            : <Btn variant="lime" className="mt-4 w-full" onClick={() => setDone(true)}>نسخ البيانات</Btn>}</div></div>
    </Page>
  )
}

export function Complaints() {
  const [f, setF] = useState('قيد الانتظار')
  const rows = complaints.filter((c) => f === 'الكل' || c.status === f || c.cat === f)
  return (
    <Page title="الشكاوى" sub="3 قيد الانتظار">
      <div className="mb-4 flex justify-end"><Chips items={['الكل', 'قيد الانتظار', 'مالية', 'عامة', 'مغلقة']} value={f} onChange={setF} /></div>
      {rows.length ? <Table cols={['الرقم', 'المرسل', 'التصنيف', 'النوع', 'المرجع', 'التاريخ', 'الحالة', '']} rows={rows}
        render={(c) => [c.id, c.from, c.cat, c.type, c.ref, c.date, <Badge>{c.status}</Badge>, <Link2 to={`/complaints/${c.id}`}>مراجعة</Link2>]} />
        : <div className="rounded-xl border border-line bg-white"><Empty title="لا يوجد شكاوى قيد الانتظار" text="الشكاوى المعالجة تظهر هنا. عندما يرسل الراكب شكوى جديدة ستظهر هنا مباشرة." /></div>}
    </Page>
  )
}

export function ComplaintDetail() {
  const { id } = useParams(), go = useNavigate()
  return (
    <Page title={`شكوى ${id} · خصم مكرر`} sub="مالية" actions={<><Btn variant="lime" onClick={() => go('/complaints')}>قبول وإرجاع المبلغ</Btn><Btn variant="ghost" onClick={() => go('/complaints')}>رفض مع ملاحظة</Btn></>}>
      <div className="grid gap-4 lg:grid-cols-[1fr_320px]">
        <div className="space-y-4">
          <Card title="المعاملات المرتبطة بالرحلة"><Table cols={['المعاملة', 'الوقت', 'الخط', 'المبلغ']} rows={tx.slice(0, 2)} render={(t) => [t.id, t.time, t.line, `${fmt(t.amount)} ل.س`]} /></Card>
          <Card title="القرار"><Field label="ملاحظة للراكب"><textarea className="inp h-24" placeholder="تم رد المبلغ المخصوم مرتين إلى محفظتك." /></Field></Card></div>
        <Card title="تفاصيل الشكوى"><dl className="space-y-3 text-sm"><div><dt className="text-xs text-slate-400">الراكب</dt><dd className="font-bold">رنا الحسن</dd></div>
          <div><dt className="text-xs text-slate-400">الرحلة</dt><dd>خط 5 · باص 17 · اليوم 9:40</dd></div>
          <div><dt className="text-xs text-slate-400">السائق</dt><dd>خالد العلي</dd></div></dl></Card></div>
    </Page>
  )
}

export function Reports() {
  const [p, setP] = useState('شهري')
  const cards = [['صافي الإيرادات', '184,212,500', true], ['العمولات', '37,500'], ['الرحلات', '73,700'], ['إجمالي الإيرادات', '184,250,000']]
  return (
    <Page title="التقارير المالية" sub="تشرين الثاني 2026" actions={<><Chips items={['يومي', 'أسبوعي', 'شهري', 'مخصص']} value={p} onChange={setP} /><Btn variant="ghost">تصدير Excel</Btn></>}>
      <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">{cards.map(([l, v, d]) => (
        <div key={l} className={`rounded-xl border p-5 ${d ? 'border-navy bg-navy text-white' : 'border-line bg-white'}`}><div className={`text-xs ${d ? 'text-slate-300' : 'text-slate-400'}`}>{l}</div><div className="mt-1 text-2xl font-extrabold">{v}</div><small className="text-slate-400">ل.س</small></div>))}</div>
      <div className="grid gap-4 lg:grid-cols-[1fr_340px]">
        <Card title="سجل المعاملات"><Table cols={['المعاملة', 'الراكب', 'الخط', 'المبلغ', 'الوقت', 'الحالة']} rows={tx} render={(t) => [t.id, t.who, t.line, fmt(t.amount), t.time, <Badge tone="green">ناجحة</Badge>]} /></Card>
        <Card title="الإيرادات حسب الخط"><ul className="space-y-4">{byLine.map(([n, w]) => (
          <li key={n}><div className="mb-1 flex justify-between text-xs"><span className="font-semibold">{n}</span><span className="text-slate-400">{w}%</span></div>
            <div className="h-2 rounded-full bg-slate-100"><div className="h-2 rounded-full bg-navy" style={{ width: `${w}%` }} /></div></li>))}</ul></Card></div>
    </Page>
  )
}
