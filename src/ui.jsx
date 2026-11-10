import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useEffect } from 'react'

const cx = (...a) => a.filter(Boolean).join(' ')
const tones = { green: 'bg-lime text-navy', red: 'bg-red-100 text-red-600', gray: 'bg-slate-100 text-slate-500', navy: 'bg-navy text-white', amber: 'bg-amber-100 text-amber-700' }
const map = { 'أونلاين': 'green', 'منشور': 'green', 'بجولة': 'green', 'معطل': 'red', 'إعادة تعيين': 'red', 'قيد الانتظار': 'navy', 'مغلقة': 'gray', 'مسودة': 'gray', 'احتياطي': 'gray' }

export const Badge = ({ children, tone }) => (
  <span className={cx('inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold', tones[tone || map[children] || 'gray'])}>
    {tone === 'green' || map[children] === 'green' ? <i className="h-1.5 w-1.5 rounded-full bg-navy" /> : null}{children}</span>
)
export const Btn = ({ variant = 'dark', className, ...p }) => (
  <button {...p} className={cx('rounded-lg px-4 py-2 text-sm font-bold transition active:scale-95 disabled:opacity-50',
    variant === 'dark' && 'bg-navy text-white hover:bg-navy-700', variant === 'lime' && 'bg-lime text-navy hover:bg-lime-600',
    variant === 'ghost' && 'border border-line bg-white hover:bg-slate-50', className)} />
)
export const Card = ({ title, action, children, className }) => (
  <section className={cx('rounded-xl border border-line bg-white', className)}>
    {title && <header className="flex items-center justify-between px-5 pt-4"><h3 className="font-bold">{title}</h3>{action}</header>}
    <div className="p-5">{children}</div></section>
)
export const Field = ({ label, error, children }) => (
  <label className="block text-sm"><span className="mb-1 block text-xs text-slate-500">{label}</span>{children}
    {error && <span className="mt-1 block text-xs text-red-500">{error}</span>}</label>
)
export const Chips = ({ items, value, onChange }) => (
  <div className="flex gap-2">{items.map((i) => (
    <button key={i} onClick={() => onChange(i)} className={cx('rounded-full border px-4 py-1 text-xs font-semibold transition', value === i ? 'border-navy bg-navy text-white' : 'border-line bg-white text-slate-500 hover:border-navy')}>{i}</button>))}</div>
)
export const Empty = ({ title, text, action }) => (
  <div className="flex flex-col items-center gap-2 py-24 text-center"><div className="mb-2 h-12 w-12 rounded-full bg-slate-100" />
    <h3 className="text-lg font-extrabold">{title}</h3><p className="max-w-xs text-sm text-slate-400">{text}</p>{action}</div>
)
export const Table = ({ cols, rows, render }) => (
  <div className="overflow-x-auto rounded-xl border border-line bg-white"><table className="w-full">
    <thead className="border-b border-line"><tr>{cols.map((c) => <th key={c} className="th">{c}</th>)}</tr></thead>
    <tbody>{rows.map((r, i) => <tr key={i} className="border-b border-line last:border-0 hover:bg-slate-50">{render(r).map((c, j) => <td key={j} className="td">{c}</td>)}</tr>)}</tbody></table></div>
)
export function Modal({ title, sub, onClose, children, footer }) {
  useEffect(() => { const h = (e) => e.key === 'Escape' && onClose(); addEventListener('keydown', h); return () => removeEventListener('keydown', h) }, [onClose])
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-navy/60 p-4" onClick={onClose}>
      <div role="dialog" aria-modal className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl" onClick={(e) => e.stopPropagation()}>
        <div className="mb-1 flex items-start justify-between"><h2 className="text-lg font-extrabold">{title}</h2>
          <button onClick={onClose} aria-label="إغلاق" className="text-slate-400 hover:text-navy">✕</button></div>
        {sub && <p className="mb-4 text-xs text-slate-400">{sub}</p>}{children}
        <div className="mt-5 flex gap-2">{footer}</div></div></div>
  )
}
export const Page = ({ title, sub, actions, children }) => (
  <div className="p-8"><div className="mb-6 flex items-start justify-between gap-4"><div><h1 className="text-2xl font-extrabold">{title}</h1>
    {sub && <p className="text-xs text-slate-400">{sub}</p>}</div><div className="flex gap-2">{actions}</div></div>{children}</div>
)

const nav = [['/', 'الرئيسية'], ['/lines', 'الخطوط والمحطات'], ['/buses', 'الحافلات'], ['/drivers', 'السائقون'], ['/complaints', 'الشكاوى', 3], ['/reports', 'التقارير المالية']]
export function Layout() {
  const go = useNavigate()
  return (
    <div className="flex min-h-screen">
      <aside className="sticky top-0 flex h-screen w-60 shrink-0 flex-col bg-navy p-4 text-white">
        <div className="mb-8 px-2 pt-2"><div className="text-xl font-extrabold">مساري <span className="text-lime">MASARY</span></div><div className="text-[11px] text-slate-400">لوحة الإدارة</div></div>
        <nav className="flex flex-col gap-1">{nav.map(([to, l, n]) => (
          <NavLink key={to} to={to} end={to === '/'} className={({ isActive }) => cx('flex items-center justify-between rounded-lg px-3 py-2 text-sm font-semibold transition', isActive ? 'bg-lime text-navy' : 'text-slate-300 hover:bg-navy-800')}>
            {l}{n && <span className="grid h-5 min-w-5 place-items-center rounded-full bg-red-500 px-1 text-[10px] text-white">{n}</span>}</NavLink>))}</nav>
        <button onClick={() => go('/login')} className="mt-auto rounded-lg bg-navy-800 p-3 text-start text-xs hover:bg-navy-700">
          <div className="font-bold">مديرية النقل · حمص</div><div className="text-slate-400">تسجيل الخروج</div></button>
      </aside>
      <main className="min-w-0 flex-1"><Outlet /></main>
    </div>
  )
}

export function MapView({ className }) {
  const pts = [[40, 230], [140, 190], [140, 110], [240, 100], [330, 40]]
  return (
    <div className={cx('relative overflow-hidden rounded-xl bg-canvas', className)}>
      <svg viewBox="0 0 400 270" className="h-full w-full" role="img" aria-label="خريطة حية">
        <g stroke="#E3E5E0" strokeWidth="10" fill="none"><path d="M0 150H400M0 60H400M90 0V270M250 0V270" /></g>
        <polyline points={pts.map((p) => p.join(',')).join(' ')} fill="none" stroke="#7CF03A" strokeWidth="4" strokeLinejoin="round" />
        {pts.map(([x, y], i) => <circle key={i} cx={x} cy={y} r="6" fill="#0E1F3B" stroke="#fff" strokeWidth="2" />)}
      </svg></div>
  )
}
