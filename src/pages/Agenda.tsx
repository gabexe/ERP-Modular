import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Calendar, 
  Clock, 
  Plus, 
  ChevronLeft, 
  ChevronRight,
  MapPin,
  User,
  Phone
} from "lucide-react";
import { useState } from "react";

const Agenda = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  
  const appointments = [
    {
      id: 1,
      title: "Reunión con Cliente ABC",
      client: "María González",
      time: "09:00",
      duration: "1h",
      type: "reunión",
      status: "confirmada",
      location: "Oficina Central",
      phone: "+54 11 1234-5678"
    },
    {
      id: 2,
      title: "Inspección de Obra",
      client: "Constructora XYZ",
      time: "11:30",
      duration: "2h",
      type: "inspección",
      status: "pendiente",
      location: "Av. Corrientes 1234",
      phone: "+54 11 8765-4321"
    },
    {
      id: 3,
      title: "Entrega de Materiales",
      client: "Carlos Ruiz",
      time: "15:00",
      duration: "30min",
      type: "entrega",
      status: "en-curso",
      location: "Barrio Norte",
      phone: "+54 11 5555-0123"
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "confirmada":
        return <Badge className="status-success">Confirmada</Badge>;
      case "pendiente":
        return <Badge className="status-warning">Pendiente</Badge>;
      case "en-curso":
        return <Badge className="status-info">En Curso</Badge>;
      case "cancelada":
        return <Badge className="status-error">Cancelada</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "reunión":
        return "text-blue-400";
      case "inspección":
        return "text-orange-400";
      case "entrega":
        return "text-green-400";
      default:
        return "text-gray-400";
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('es-ES', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const changeDate = (days: number) => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + days);
    setCurrentDate(newDate);
  };

  return (
    <div className="space-y-6 fade-in">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Agenda</h1>
          <p className="text-muted-foreground">
            Coordinación de servicios y gestión de citas
          </p>
        </div>
        <Button className="btn-primary">
          <Plus className="w-4 h-4 mr-2" />
          Nueva Cita
        </Button>
      </div>

      {/* Date Navigation */}
      <Card className="card-gradient">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <Button 
              variant="outline" 
              size="icon"
              onClick={() => changeDate(-1)}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            
            <div className="text-center">
              <h2 className="text-xl font-semibold">{formatDate(currentDate)}</h2>
              <p className="text-sm text-muted-foreground">{appointments.length} citas programadas</p>
            </div>
            
            <Button 
              variant="outline" 
              size="icon"
              onClick={() => changeDate(1)}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Daily Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="card-gradient">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Citas Hoy</p>
                <p className="text-2xl font-bold">8</p>
              </div>
              <Calendar className="w-8 h-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="card-gradient">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Horas Ocupadas</p>
                <p className="text-2xl font-bold">6.5h</p>
              </div>
              <Clock className="w-8 h-8 text-warning" />
            </div>
          </CardContent>
        </Card>

        <Card className="card-gradient">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Tiempo Libre</p>
                <p className="text-2xl font-bold">1.5h</p>
              </div>
              <Clock className="w-8 h-8 text-success" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Appointments List */}
      <Card className="card-gradient">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Calendar className="w-5 h-5 mr-2" />
            Citas del Día
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {appointments.map((appointment) => (
              <div key={appointment.id} className="flex items-center justify-between p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                <div className="flex items-center space-x-4">
                  <div className="flex flex-col items-center">
                    <span className="text-lg font-bold">{appointment.time}</span>
                    <span className="text-xs text-muted-foreground">{appointment.duration}</span>
                  </div>
                  
                  <div className="w-1 h-12 bg-primary rounded-full"></div>
                  
                  <div className="flex-1">
                    <h3 className="font-semibold">{appointment.title}</h3>
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground mt-1">
                      <div className="flex items-center">
                        <User className="w-4 h-4 mr-1" />
                        {appointment.client}
                      </div>
                      <div className="flex items-center">
                        <MapPin className="w-4 h-4 mr-1" />
                        {appointment.location}
                      </div>
                      <div className="flex items-center">
                        <Phone className="w-4 h-4 mr-1" />
                        {appointment.phone}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <span className={`text-xs font-medium capitalize ${getTypeColor(appointment.type)}`}>
                    {appointment.type}
                  </span>
                  {getStatusBadge(appointment.status)}
                  <div className="flex space-x-2">
                    <Button size="sm" variant="outline">
                      Contactar
                    </Button>
                    <Button size="sm" className="btn-primary">
                      Ver Detalles
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Agenda;