import { Routes, Route } from 'react-router-dom'
import { Layout } from './ui'
import { Login, Dashboard, Lines, LineEdit, Buses, Drivers, DriverNew, Complaints, ComplaintDetail, Reports } from './pages'

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route element={<Layout />}>
        <Route index element={<Dashboard />} />
        <Route path="lines" element={<Lines />} />
        <Route path="lines/:id" element={<LineEdit />} />
        <Route path="buses" element={<Buses />} />
        <Route path="drivers" element={<Drivers />} />
        <Route path="drivers/new" element={<DriverNew />} />
        <Route path="complaints" element={<Complaints />} />
        <Route path="complaints/:id" element={<ComplaintDetail />} />
        <Route path="reports" element={<Reports />} />
      </Route>
    </Routes>
  )
}
