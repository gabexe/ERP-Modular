import { Bell, Search, User, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { SidebarTrigger } from "@/components/ui/sidebar";

import { toast } from "sonner";
import { useAuth } from "@/lib/useAuth";
import { useProfile } from "@/lib/useProfile";
import { useRoles } from "@/lib/useRoles";
import { useNavigate } from "react-router-dom";

export function TopHeader() {
  const notificationCount = 0;
  const { user, signOut } = useAuth();
  const { profile } = useProfile();
  const navigate = useNavigate();

  // Determinar rol visual
  const { userRole } = useRoles();
  const role = userRole?.role === 'admin' ? 'Administrador' : userRole?.role === 'editor' ? 'Editor' : 'Visualizador';
  const displayName = user?.user_metadata?.name || user?.email?.split('@')[0] || 'Usuario';

  const handleProfile = () => {
    navigate("/configuracion");
  };
  const handleLogout = async () => {
    await signOut();
    navigate("/login");
  };

  return (
    <header className="h-14 md:h-16 bg-card border-b border-border flex items-center justify-between px-3 md:px-6 sticky top-0 z-10">
      {/* Left side - Sidebar trigger, greeting and search */}
      <div className="flex items-center space-x-2 md:space-x-4 flex-1">
        <SidebarTrigger className="text-muted-foreground hover:text-foreground" />
        <div className="flex flex-col flex-1">
          <div className="relative max-w-sm md:max-w-md lg:w-96">
            <Search className="absolute left-2 md:left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              type="search"
              placeholder="Buscar..."
              className="pl-8 md:pl-10 bg-input border-border focus:ring-primary text-sm md:text-base h-8 md:h-10"
            />
          </div>
        </div>
      </div>

      {/* Right side - Notifications and user menu */}
      <div className="flex items-center space-x-2 md:space-x-4">
        {/* Notifications */}
        <div className="relative">
          <Button
            variant="ghost"
            size="sm"
            className="relative"
            onClick={() => toast.info("Esta función está en desarrollo.")}
          >
            <Bell className="w-4 h-4 md:w-5 md:h-5" />
            {notificationCount > 0 && (
              <Badge
                variant="destructive"
                className="absolute -top-1 -right-1 w-4 h-4 md:w-5 md:h-5 flex items-center justify-center text-xs p-0"
              >
                {notificationCount}
              </Badge>
            )}
          </Button>
        </div>

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="ghost" 
              className="flex items-center space-x-1 md:space-x-2 hover:bg-muted p-1 md:p-2"
            >
              <div className="w-6 h-6 md:w-8 md:h-8 bg-primary rounded-full flex items-center justify-center">
                <User className="w-3 h-3 md:w-4 md:h-4 text-primary-foreground" />
              </div>
              <div className="hidden lg:block text-left">
                <p className="text-xs md:text-sm font-medium">{displayName}</p>
                <p className="text-xs text-muted-foreground">{role}</p>
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48 md:w-56">
            <DropdownMenuItem onClick={handleProfile}>
              <User className="mr-2 h-4 w-4" />
              <span>Mi Perfil</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => toast.info("Esta función está en desarrollo.")}>
              <Bell className="mr-2 h-4 w-4" />
              <span>Notificaciones</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-red-600" onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Cerrar Sesión</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
