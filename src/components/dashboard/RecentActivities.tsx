import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, ArrowRight, Clock, CheckCircle, AlertTriangle, Receipt, FolderOpen, Calendar } from "lucide-react";
import { initialAppointments } from "@/lib/mock-data";
import { initialInvoices } from "@/lib/mock-data";
import { initialProjects } from "@/lib/mock-data";

// --- Helper Functions ---

function formatRelativeTime(date: Date): string {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const diffSeconds = Math.floor(diff / 1000);
  const diffMinutes = Math.floor(diffSeconds / 60);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffDays > 1) return `Hace ${diffDays} días`;
  if (diffDays === 1) return `Ayer`;
  if (diffHours > 1) return `Hace ${diffHours} horas`;
  if (diffHours === 1) return `Hace 1 hora`;
  if (diffMinutes > 1) return `Hace ${diffMinutes} minutos`;
  return `Hace un momento`;
}

const statusConfig: { [key: string]: { icon: JSX.Element; badge: JSX.Element; } } = {
  // Invoice statuses
  pagada: { 
    icon: <CheckCircle className="w-4 h-4 text-green-500" />, 
    badge: <Badge className="bg-green-500/20 text-green-400 border-green-500/30">Pagada</Badge> 
  },
  vencida: { 
    icon: <AlertTriangle className="w-4 h-4 text-red-500" />, 
    badge: <Badge className="bg-red-500/20 text-red-400 border-red-500/30">Vencida</Badge> 
  },
  // Project statuses
  completado: { 
    icon: <CheckCircle className="w-4 h-4 text-green-500" />, 
    badge: <Badge className="bg-green-500/20 text-green-400 border-green-500/30">Completado</Badge> 
  },
  "en-progreso": { 
    icon: <Clock className="w-4 h-4 text-blue-500" />, 
    badge: <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">En Progreso</Badge> 
  },
  // Generic/shared statuses
  pendiente: { 
    icon: <Clock className="w-4 h-4 text-yellow-500" />, 
    badge: <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">Pendiente</Badge> 
  },
  confirmada: { 
    icon: <CheckCircle className="w-4 h-4 text-green-500" />, 
    badge: <Badge className="bg-green-500/20 text-green-400 border-green-500/30">Confirmada</Badge> 
  },
  urgente: { 
    icon: <AlertTriangle className="w-4 h-4 text-red-500" />, 
    badge: <Badge className="bg-red-500/20 text-red-400 border-red-500/30">Urgente</Badge> 
  },
};

const typeConfig: { [key: string]: { icon: JSX.Element; color: string; } } = {
  proyecto: { icon: <FolderOpen className="w-4 h-4" />, color: "text-blue-400" },
  factura: { icon: <Receipt className="w-4 h-4" />, color: "text-yellow-400" },
  cita: { icon: <Calendar className="w-4 h-4" />, color: "text-purple-400" },
};

// --- Component ---

export function RecentActivities() {
  const recentActivities = useMemo(() => {
    const projects = initialProjects.map(p => ({
      id: p.id,
      type: 'proyecto' as const,
      title: `Proyecto ${p.status}`,
      description: p.name,
      date: new Date(p.dueDate),
      status: p.status,
    }));

    const invoices = initialInvoices.map(i => ({
      id: i.id,
      type: 'factura' as const,
      title: `Factura ${i.status}`,
      description: `Factura ${i.id} para ${i.client}`,
      date: new Date(i.date),
      status: i.status,
    }));

    const appointments = initialAppointments.map(a => ({
      id: a.id.toString(),
      type: 'cita' as const,
      title: `Cita ${a.status}`,
      description: a.title,
      date: a.date, // Already a Date object
      status: a.status,
    }));

    const allActivities = [...projects, ...invoices, ...appointments];
    
    // Sort by date, most recent first
    allActivities.sort((a, b) => b.date.getTime() - a.date.getTime());

    return allActivities.slice(0, 5);
  }, []);

  return (
    <Card className="col-span-1 lg:col-span-2 card-gradient">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-base md:text-lg font-semibold">Actividades Recientes</CardTitle>
        <Button variant="ghost" size="sm" className="text-primary hover:text-primary-hover hidden md:flex">
          Ver todas
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-3 md:space-y-4">
          {recentActivities.map((activity) => {
            const status = statusConfig[activity.status] || statusConfig.pendiente;
            const type = typeConfig[activity.type];

            return (
              <div key={`${activity.type}-${activity.id}`} className="flex items-start space-x-3 md:space-x-4 p-2 md:p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                <div className="flex-shrink-0 mt-1">
                  {status.icon}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-1 gap-1">
                    <h4 className="text-sm font-medium truncate">{activity.title}</h4>
                    {status.badge}
                  </div>
                  <p className="text-xs md:text-sm text-muted-foreground mb-2">
                    {activity.description}
                  </p>
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                    <span className="text-xs text-muted-foreground">{formatRelativeTime(activity.date)}</span>
                    <span className={`flex items-center text-xs font-medium capitalize ${type.color}`}>
                      {type.icon} <span className="ml-1">{activity.type}</span>
                    </span>
                  </div>
                </div>
                
                <Button variant="ghost" size="sm" className="flex-shrink-0 hidden sm:flex">
                  <Eye className="w-4 h-4" />
                </Button>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  );
}
