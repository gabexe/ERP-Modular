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
}

const quickActions: QuickAction[] = [
  {
    title: "Nuevo Cliente",
    description: "Registrar cliente en CRM",
    icon: <UserPlus className="w-5 h-5" />,
    href: "/crm/nuevo",
    variant: "primary"
  },
  {
    title: "Crear Factura",
    description: "Generar nueva factura",
    icon: <FileText className="w-5 h-5" />,
    href: "/facturacion/nueva",
    variant: "primary"
  },
  {
    title: "Programar Cita",
    description: "Agendar nueva cita",
    icon: <Calendar className="w-5 h-5" />,
    href: "/agenda/nueva",
    variant: "secondary"
  },
  {
    title: "Agregar Producto",
    description: "Añadir al inventario",
    icon: <Package className="w-5 h-5" />,
    href: "/inventario/nuevo",
    variant: "secondary"
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
    href: "/proyectos/nuevo",
    variant: "secondary"
  }
];

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
      action: () => openModal('client')
    },
    {
      title: "Crear Factura",
      description: "Generar nueva factura",
      icon: <FileText className="w-5 h-5" />,
      href: "/facturacion",
      variant: "primary"
    },
    {
      title: "Programar Cita",
      description: "Agendar nueva cita",
      icon: <Calendar className="w-5 h-5" />,
      href: "/agenda",
      variant: "secondary"
    },
    {
      title: "Agregar Producto",
      description: "Añadir al inventario",
      icon: <Package className="w-5 h-5" />,
      href: "/inventario",
      variant: "secondary"
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
      variant: "secondary"
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
        <CardTitle className="text-lg font-semibold">Acciones Rápidas</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-3">
          {quickActions.map((action, index) => (
            <Button
              key={index}
              variant={action.variant === "primary" ? "default" : "outline"}
              className={`h-auto p-4 justify-start text-left transition-all duration-200 hover:scale-105 ${
                action.variant === "primary" 
                  ? "btn-primary" 
                  : "hover:bg-muted border-muted-foreground/20"
              }`}
              onClick={() => handleActionClick(action)}
            >
                <div className="flex items-center space-x-3 w-full">
                  <div className={`flex-shrink-0 ${
                    action.variant === "primary" 
                      ? "text-primary-foreground" 
                      : "text-primary"
                  }`}>
                    {action.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm">{action.title}</div>
                    <div className={`text-xs ${
                      action.variant === "primary" 
                        ? "text-primary-foreground/80" 
                        : "text-muted-foreground"
                    }`}>
                      {action.description}
                    </div>
                  </div>
                  <ArrowRight className={`w-4 h-4 flex-shrink-0 ${
                    action.variant === "primary" 
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