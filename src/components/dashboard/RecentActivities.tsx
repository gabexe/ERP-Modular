import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, ArrowRight, Clock, CheckCircle, AlertTriangle } from "lucide-react";

interface Activity {
  id: string;
  type: "cliente" | "proyecto" | "factura" | "inventario";
  title: string;
  description: string;
  timestamp: string;
  status: "completado" | "pendiente" | "urgente";
}

const activities: Activity[] = [
  {
    id: "1",
    type: "cliente",
    title: "Nuevo cliente registrado",
    description: "María González se registró como cliente premium",
    timestamp: "Hace 5 minutos",
    status: "completado"
  },
  {
    id: "2",
    type: "proyecto",
    title: "Proyecto web finalizado",
    description: "Sitio web corporativo para ABC Corp completado",
    timestamp: "Hace 2 horas",
    status: "completado"
  },
  {
    id: "3",
    type: "factura",
    title: "Factura vencida",
    description: "Factura #1234 de Cliente XYZ está vencida",
    timestamp: "Hace 1 día",
    status: "urgente"
  },
  {
    id: "4",
    type: "inventario",
    title: "Stock bajo detectado",
    description: "Material de construcción por debajo del mínimo",
    timestamp: "Hace 2 días",
    status: "pendiente"
  },
  {
    id: "5",
    type: "cliente",
    title: "Reunión programada",
    description: "Reunión con Empresa ABC para el próximo lunes",
    timestamp: "Hace 3 días",
    status: "pendiente"
  }
];

function getStatusIcon(status: Activity["status"]) {
  switch (status) {
    case "completado":
      return <CheckCircle className="w-4 h-4 text-success" />;
    case "pendiente":
      return <Clock className="w-4 h-4 text-warning" />;
    case "urgente":
      return <AlertTriangle className="w-4 h-4 text-error" />;
  }
}

function getStatusBadge(status: Activity["status"]) {
  switch (status) {
    case "completado":
      return <Badge className="status-success">Completado</Badge>;
    case "pendiente":
      return <Badge className="status-warning">Pendiente</Badge>;
    case "urgente":
      return <Badge className="status-error">Urgente</Badge>;
  }
}

function getTypeColor(type: Activity["type"]) {
  switch (type) {
    case "cliente":
      return "text-blue-400";
    case "proyecto":
      return "text-green-400";
    case "factura":
      return "text-yellow-400";
    case "inventario":
      return "text-purple-400";
    default:
      return "text-gray-400";
  }
}

export function RecentActivities() {
  return (
    <Card className="col-span-1 lg:col-span-2 card-gradient">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-semibold">Actividades Recientes</CardTitle>
        <Button variant="ghost" size="sm" className="text-primary hover:text-primary-hover">
          Ver todas
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity) => (
            <div key={activity.id} className="flex items-start space-x-4 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
              <div className="flex-shrink-0 mt-1">
                {getStatusIcon(activity.status)}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="text-sm font-medium truncate">{activity.title}</h4>
                  {getStatusBadge(activity.status)}
                </div>
                <p className="text-sm text-muted-foreground mb-2">
                  {activity.description}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">{activity.timestamp}</span>
                  <span className={`text-xs font-medium capitalize ${getTypeColor(activity.type)}`}>
                    {activity.type}
                  </span>
                </div>
              </div>
              
              <Button variant="ghost" size="icon" className="flex-shrink-0">
                <Eye className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}