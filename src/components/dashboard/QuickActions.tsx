import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Plus, 
  UserPlus, 
  FileText, 
  Calendar, 
  Package, 
  BarChart3,
  ArrowRight 
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useModalStore } from "@/store/useModalStore";

interface QuickAction {
  title: string;
  description: string;
  icon: React.ReactNode;
  href: string;
  variant: "primary" | "secondary";
  action?: () => void;
  customClass?: string;
}

export function QuickActions() {
  const navigate = useNavigate();
  const { openModal } = useModalStore();

  const quickActions: QuickAction[] = [
    {
      title: "Nuevo Cliente",
      description: "Registrar cliente en CRM",
      icon: <UserPlus className="w-5 h-5" />,
      href: "/crm",
      variant: "primary",
      action: () => openModal('client'),
      customClass: "border border-primary bg-[#121212] text-foreground hover:bg-primary-light hover:text-foreground"
    },
    {
      title: "Crear Factura",
      description: "Generar nueva factura",
      icon: <FileText className="w-5 h-5" />,
      href: "/facturacion",
      variant: "primary",
      action: () => openModal('invoice'),
      customClass: "border border-primary bg-[#121212] text-foreground hover:bg-primary-light hover:text-foreground"
    },
    {
      title: "Programar Cita",
      description: "Agendar nueva cita",
      icon: <Calendar className="w-5 h-5" />,
      href: "/agenda",
      variant: "secondary",
      action: () => openModal('appointment')
    },
    {
      title: "Agregar Producto",
      description: "Añadir al inventario",
      icon: <Package className="w-5 h-5" />,
      href: "/inventario",
      variant: "secondary",
      action: () => openModal('product')
    },
    {
      title: "Ver Reportes",
      description: "Análisis y estadísticas",
      icon: <BarChart3 className="w-5 h-5" />,
      href: "/reportes",
      variant: "secondary"
    },
    {
      title: "Nuevo Proyecto",
      description: "Crear proyecto",
      icon: <Plus className="w-5 h-5" />,
      href: "/proyectos",
      variant: "secondary",
      action: () => openModal('project')
    }
  ];

  const handleActionClick = (action: QuickAction) => {
    navigate(action.href);
    if (action.action) {
      // Use a timeout to ensure the navigation has completed
      // and the destination component has mounted before opening the modal.
      setTimeout(() => {
        action.action!();
      }, 50);
    }
  };

  return (
    <Card className="card-gradient">
      <CardHeader>
        <CardTitle className="text-base md:text-lg font-semibold">Acciones Rápidas</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-2 md:gap-3">
          {quickActions.map((action, index) => (
            <Button
              key={index}
              variant={action.variant === "primary" ? "default" : "outline"}
              className={`h-auto p-3 md:p-4 justify-start text-left transition-all duration-200 hover:scale-105 ${
                action.customClass
                  ? action.customClass
                  : action.variant === "primary" 
                    ? "btn-primary" 
                    : "hover:bg-muted border-muted-foreground/20"
              }`}
              onClick={() => handleActionClick(action)}
            >
                <div className="flex items-center space-x-2 md:space-x-3 w-full">
                  <div className={`flex-shrink-0 ${
                    action.customClass
                      ? "text-primary"
                      : action.variant === "primary"
                        ? "text-primary-foreground"
                        : "text-primary"
                  }`}>
                    {action.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm md:text-base">{action.title}</div>
                    <div className={`text-xs md:text-sm ${
                      action.customClass
                        ? "text-muted-foreground"
                        : action.variant === "primary"
                          ? "text-primary-foreground/80"
                          : "text-muted-foreground"
                    }`}>
                      {action.description}
                    </div>
                  </div>
                  <ArrowRight className={`w-3 h-3 md:w-4 md:h-4 flex-shrink-0 ${
                    action.customClass
                      ? "text-muted-foreground"
                      : action.variant === "primary"
                        ? "text-primary-foreground/80"
                        : "text-muted-foreground"
                  }`} />
                </div>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}