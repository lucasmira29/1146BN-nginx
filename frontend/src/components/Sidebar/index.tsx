import {
  Bell,
  Calendar,
  ChevronsUpDown,
  Home,
  BriefcaseMedical,
  UserRound,
  LogOut,
  Settings,
  User2,
  CalendarPlus,
  UserPlus,
  Stethoscope, // Ícone mais adequado para "Minhas Consultas"
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import useAuth from "@/hooks/useAuthContext";
import { getInitials } from "@/utils/getInitials";
import { NavLink, useNavigate } from "react-router";

// Estrutura de itens aprimorada com `allowedRoles`
const menuItems = [
  {
    title: "Home",
    url: "/dashboard/home",
    icon: Home,
  },
  {
    title: "Agenda",
    url: "/dashboard/agenda",
    icon: Calendar,
  },
  {
    title: "Minhas Consultas",
    url: "/dashboard/minhas-consultas",
    icon: Stethoscope,
    allowedRoles: ["medico"],
  },
  {
    title: "Agendar Consulta",
    url: "/dashboard/schedule",
    icon: CalendarPlus,
    allowedRoles: ["admin", "recepcionista"],
  },
  {
    title: "Médicos",
    url: "/dashboard/medicos",
    icon: BriefcaseMedical,
    allowedRoles: ["admin", "recepcionista"],
  },
  {
    title: "Pacientes",
    url: "/dashboard/pacientes",
    icon: UserRound,
    allowedRoles: ["admin", "recepcionista"],
  },
  {
    title: "Cadastrar Paciente",
    url: "/cadastro?type=paciente",
    icon: UserPlus,
    allowedRoles: ["admin", "recepcionista"], 
  },
];

export function AppSidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const visibleItems = menuItems.filter((item) => {

    if (!item.allowedRoles) {
      return true;
    }
    
    return user?.role && item.allowedRoles.includes(user.role);
  });

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {visibleItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink to={item.url} className={({ isActive }) =>
                      isActive ? "bg-sidebar-accent text-sidebar-accent-foreground" : ""
                    }>
                      <item.icon className="h-5 w-5" />
                      <span>{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger className="cursor-pointer w-full" asChild>
                <SidebarMenuButton
                  size="lg"
                  className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                >
                  <Avatar className="h-8 w-8 rounded-lg">
                    <AvatarImage src="" alt={user?.name} />
                    <AvatarFallback className="rounded-lg">
                      {getInitials(user?.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">{user?.name}</span>
                    <span className="truncate text-xs text-muted-foreground">{user?.email}</span>
                  </div>
                  <ChevronsUpDown className="ml-auto size-4" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-64 mb-2 ml-2">
                <DropdownMenuLabel>Minha Conta</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem
                    className="cursor-pointer"
                    onClick={() => navigate("/dashboard/account")}
                  >
                    <User2 className="mr-2 h-4 w-4" />
                    <span>Perfil</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer">
                    <Bell className="mr-2 h-4 w-4" />
                    <span>Notificações</span>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="cursor-pointer focus:text-red-600"
                  onClick={() => logout()}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Sair</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}