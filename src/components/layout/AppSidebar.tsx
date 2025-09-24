import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { useAuth } from "@/lib/useAuth";
import { useRoles } from "@/lib/useRoles";
import {
  LayoutDashboard,
  Users,
  Calendar,
  Package,
  Receipt,
  FolderOpen,
  BarChart3,
  Settings,
  ChevronLeft,
  Menu,
  Building2,
  UserCog
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";

const menuItems = [
  { 
    title: "Dashboard", 
    url: "/", 
    icon: LayoutDashboard,
    description: "Vista general del sistema"
  },
  { 
    title: "CRM", 
    url: "/crm", 
    icon: Users,
    description: "Gestión de clientes"
  },
  { 
    title: "Agenda", 
    url: "/agenda", 
    icon: Calendar,
    description: "Coordinación de servicios"
  },
  { 
    title: "Inventario", 
    url: "/inventario", 
    icon: Package,
    description: "Control de stock y materiales"
  },
  { 
    title: "Facturación", 
    url: "/facturacion", 
    icon: Receipt,
    description: "Gestión de pagos y facturación"
  },
  { 
    title: "Proyectos", 
    url: "/proyectos", 
    icon: FolderOpen,
    description: "Seguimiento de trabajos"
  },
  { 
    title: "Reportes", 
    url: "/reportes", 
    icon: BarChart3,
    description: "Estadísticas y análisis"
  },
];

const settingsItems = [
  { 
    title: "Usuarios", 
    url: "/usuarios", 
    icon: UserCog,
    description: "Gestión de accesos"
  },
  { 
    title: "Configuración", 
    url: "/configuracion", 
    icon: Settings,
    description: "Ajustes del sistema"
  },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const currentPath = location.pathname;
  const collapsed = state === "collapsed";
  const { user } = useAuth();
  const { userRole } = useRoles();

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Buen día";
    if (hour < 18) return "Buenas tardes";
    return "Buenas noches";
  };

  const isActive = (path: string) => {
    if (path === "/") {
      return currentPath === "/";
    }
    return currentPath.startsWith(path);
  };

  const getNavClassName = (path: string) => {
    return isActive(path) 
      ? "nav-link nav-link-active" 
      : "nav-link";
  };

  return (
    <Sidebar
      className="transition-all duration-300 ease-in-out border-r border-sidebar-border md:block"
      collapsible="icon"
    >
      <SidebarContent className="bg-sidebar">
        {/* Header */}
        <div className="flex items-center px-3 md:px-4 py-4 md:py-6 border-b border-sidebar-border">
          <div className="flex items-center space-x-3 w-full">
            {!collapsed && (
              <div className="fade-in space-y-1 min-w-0 w-full">
                <h1 className="text-base md:text-lg font-semibold text-sidebar-foreground break-words w-full">
                  {getGreeting()}, {user?.user_metadata?.name || user?.email?.split('@')[0] || 'Usuario'}
                </h1>
                <p className="text-sm text-sidebar-foreground/70 break-words w-full">
                  {userRole?.role === 'admin' ? 'Administrador' : userRole?.role === 'editor' ? 'Editor' : 'Visualizador'}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Navigation Menu */}
        <SidebarGroup className={collapsed ? "p-1 md:p-2" : "px-2 md:px-3 py-3 md:py-4"}>
          <SidebarGroupLabel className={`${collapsed ? "hidden" : "block"} text-sidebar-foreground/60 font-medium text-sm md:text-base`}>
            Módulos Principales
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1 md:space-y-1">
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink 
                      to={item.url} 
                      className={getNavClassName(item.url)}
                      title={collapsed ? item.title : ""}
                    >
                      <item.icon className="w-4 h-4 md:w-5 md:h-5 flex-shrink-0" />
                      {!collapsed && (
                        <div className="flex flex-col min-w-0 fade-in">
                          <span className="font-medium truncate text-sm md:text-base">{item.title}</span>
                          
                        </div>
                      )}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Settings Section */}
        <SidebarGroup className={collapsed ? "p-1 md:p-2 mt-auto" : "px-2 md:px-3 py-3 md:py-4 mt-auto"}>
          <SidebarGroupLabel className={`${collapsed ? "hidden" : "block"} text-sidebar-foreground/60 font-medium text-sm md:text-base`}>
            Sistema
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1 md:space-y-1">
              {settingsItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink 
                      to={item.url} 
                      className={getNavClassName(item.url)}
                      title={collapsed ? item.title : ""}
                    >
                      <item.icon className="w-4 h-4 md:w-5 md:h-5 flex-shrink-0" />
                      {!collapsed && (
                        <div className="flex flex-col min-w-0 fade-in">
                          <span className="font-medium truncate text-sm md:text-base">{item.title}</span>
                          
                        </div>
                      )}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
