import { Routes, Route, Navigate } from "react-router";
import useAuth from "@/hooks/useAuthContext";

import Login from "@/pages/Login";
import SignUp from "@/pages/SignUp";
import Agenda from "@/components/Agenda";
import ScheduleForm from "@/features/Schedule/ScheduleForm";
import ConsultaDetails from "@/features/Consulta/ConsultaDetails";
import AccountDetails from "@/features/Account/AccountDetails";
import DefaultLayout from "@/layouts/DefaultLayout";
import DashboardHome from "@/pages/DashboardHome";
import MedicosPage from "@/pages/Medicos";
import PacientesPage from "@/pages/Pacientes";
import RequireRole from "@/components/RequireRole";
import MinhasConsultasPage from "@/pages/MinhasConsultasPage";

function AppRoutes() {
  const { user, isLoading } = useAuth();

  if (isLoading) return <p>Carregando...</p>;

  return (
    <Routes>
      <Route path="/" element={user ? <Navigate to="/dashboard" /> : <Navigate to="/login" />} />
      <Route path="/login" element={<Login />} />
      <Route path="/cadastro" element={<SignUp />} />

      {user && (
        <Route path="/dashboard" element={<DefaultLayout />}>
          <Route path="home" element={<DashboardHome />} />
          <Route path="agenda" element={<Agenda />} />
          <Route path="consulta/:id" element={<ConsultaDetails />} />
          <Route path="minhas-consultas" element={<MinhasConsultasPage />} />
          <Route path="account" element={<AccountDetails />} />

          {/* permitir apenas para admin e recepcionista */}
          <Route element={<RequireRole allowedRoles={["admin", "recepcionista"]} />}>
            <Route path="schedule" element={<ScheduleForm />} />
            <Route path="medicos" element={<MedicosPage />} />
            <Route path="pacientes" element={<PacientesPage />} />
          </Route>
        </Route>
      )}

      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default AppRoutes;
