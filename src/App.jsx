// src/App.jsx
import { Routes, Route } from "react-router-dom";
import { Layout } from "./components/ui";
import { Login } from "./pages/Login";
import { Dashboard } from "./pages/Dashboard";
import { Lines } from "./pages/Lines";
import { LineEdit } from "./pages/LineEdit";
import { Buses } from "./pages/Buses";
import { Drivers } from "./pages/Drivers";
import { DriverNew } from "./pages/DriverNew";
import { Complaints } from "./pages/Complaints";
import { ComplaintDetail } from "./pages/ComplaintDetail";
import { Reports } from "./pages/Reports";

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
  );
}
