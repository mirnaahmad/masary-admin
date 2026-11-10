import { useEffect, useState } from 'react'
// ضع VITE_API_URL في ملف .env لتفعيل الربط الحقيقي، وإلا تعمل البيانات التجريبية
const BASE = import.meta.env.VITE_API_URL
const wait = (ms = 700) => new Promise((r) => setTimeout(r, ms))
async function call(path, mock, opts = {}) {
  if (!BASE) { await wait(); return mock }
  const r = await fetch(BASE + path, { ...opts, headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('token') || ''}` } })
  if (!r.ok) throw new Error(`HTTP ${r.status}`)
  return r.json()
}
export const api = {
  dashboard: () => call('/dashboard', { stats: [['باصات شغالة', '18 / 24', true], ['ركاب اليوم', '3,420'], ['إيرادات اليوم', '8,550,000'], ['شكاوى جديدة', '3']],
    buses: [{ id: 5, pos: [34.7255, 36.7075], on: true }, { id: 9, pos: [34.7300, 36.7150], on: false }, { id: 12, pos: [34.7350, 36.7200], on: true }] }),
  sendExtraBus: (lineId, busId) => call(`/lines/${lineId}/extra-bus`, { ok: true }, { method: 'POST', body: JSON.stringify({ busId }) }),
  reassignBus: (busId, newBusId, unassign) => call(`/buses/${busId}/reassign`, { ok: true }, { method: 'POST', body: JSON.stringify({ newBusId, unassign }) }),
}
export function useLoad(fn) {
  const [s, set] = useState({ data: null, loading: true, error: null })
  useEffect(() => { let on = true; fn().then((data) => on && set({ data, loading: false, error: null })).catch((error) => on && set({ data: null, loading: false, error })); return () => { on = false } }, [])
  return s
}
