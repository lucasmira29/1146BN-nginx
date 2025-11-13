import { AppSidebar } from "@/components/Sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import useAuth from "@/hooks/useAuthContext";
import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router";
import Logo from "@/img/logo.png";

function DefaultLayout() {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && user === null) {
      navigate("/login");
    }
  }, [user, isLoading, navigate]);

  return (
    <>
      <header className="w-full bg-white shadow-sm px-12 py-5 flex justify-center items-center gap-3 border-b border-gray-200">
        <img src={Logo} alt="Logo" className="w-[48px]" />
        <h1 className="font-display font-semibold text-3xl tracking-tight text-slate-800">
          Perebentos
        </h1>
      </header>
      <SidebarProvider>
        <AppSidebar />
        <div className="flex-1 sm:p-6 p-3 bg-gray-50">
          <SidebarTrigger />
          <main>
            <Outlet />
          </main>
        </div>
      </SidebarProvider>
    </>
  );
}

export default DefaultLayout;
