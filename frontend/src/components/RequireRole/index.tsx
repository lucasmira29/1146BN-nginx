import { Navigate, Outlet } from "react-router";
import useAuth from "@/hooks/useAuthContext";

function RequireRole({ allowedRoles }: { allowedRoles: string[] }) {
  const { user } = useAuth();

  if (!user) return <Navigate to="/login" replace />;
  if (!allowedRoles.includes(user.role)) return <Navigate to="/dashboard/home" replace />;

  return <Outlet />;
}

export default RequireRole;
