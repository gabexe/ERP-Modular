import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  MoreVertical,
  Trash2,
  Calendar, 
  Plus, 
  ChevronLeft, 
  ChevronRight,
  MapPin,
  User,
  Phone,
  Edit
} from "lucide-react";
import { useState, useMemo } from "react";
import { useModalStore } from "@/store/useModalStore";
import { useAgendaStore } from "@/store/useAgendaStore";

const Agenda = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const { appointments, deleteAppointment } = useAgendaStore();
  const { openModal } = useModalStore();

  const filteredAppointments = useMemo(() => 
    appointments.filter(
      (appointment) => 
        new Date(appointment.date).toDateString() === currentDate.toDateString()
    ).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()),
    [appointments, currentDate]
  );

  const handleNewAppointment = () => {
    openModal('appointment');
  };

  const handleEditAppointment = (appointment: any) => {
    openModal('appointment', { appointment });
  };

  const handleDeleteAppointment = (id: number) => {
    deleteAppointment(id);
  };

  const handleViewDetails = (appointment: any) => {
    localStorage.setItem("selectedAppointment", JSON.stringify(appointment));
    window.open("/cita-detalles", "_blank");
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "confirmada": return <Badge className="bg-green-500/20 text-green-400 border-green-500/30">Confirmada</Badge>;
      case "pendiente": return <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">Pendiente</Badge>;
      case "en-curso": return <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">En Curso</Badge>;
      case "cancelada": return <Badge className="bg-red-500/20 text-red-400 border-red-500/30">Cancelada</Badge>;
      default: return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "reunión": return "text-blue-400";
      case "inspección": return "text-orange-400";
      case "entrega": return "text-green-400";
      case "llamada": return "text-purple-400";
      default: return "text-gray-400";
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
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
          <p className="text-muted-foreground">Coordinación de servicios y gestión de citas</p>
        </div>
        <Button className="btn-primary" onClick={handleNewAppointment}>
          <Plus className="w-4 h-4 mr-2" />
          Nueva Cita
        </Button>
      </div>

      {/* Date Navigation */}
      <Card className="card-gradient">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <Button variant="outline" size="icon" onClick={() => changeDate(-1)}>
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <div className="text-center">
              <h2 className="text-xl font-semibold">{formatDate(currentDate)}</h2>
              <p className="text-sm text-muted-foreground">
                {filteredAppointments.length} {filteredAppointments.length === 1 ? 'cita programada' : 'citas programadas'}
              </p>
            </div>
            <Button variant="outline" size="icon" onClick={() => changeDate(1)}>
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

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
            {filteredAppointments.length > 0 ? (
              filteredAppointments.map((appointment) => (
                <div key={appointment.id} className="flex flex-col md:flex-row items-start md:items-center justify-between p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                  <div className="flex items-center space-x-4 flex-grow">
                    <div className="flex flex-col items-center">
                      <span className="text-lg font-bold">{appointment.date.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                    <div className="w-1 h-12 bg-primary rounded-full hidden md:block"></div>
                    <div className="flex-1">
                      <h3 className="font-semibold">{appointment.title}</h3>
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground mt-1">
                        <div className="flex items-center"><User className="w-4 h-4 mr-1" />{appointment.client}</div>
                        <div className="flex items-center"><MapPin className="w-4 h-4 mr-1" />{appointment.location}</div>
                        <div className="flex items-center"><Phone className="w-4 h-4 mr-1" />{appointment.phone}</div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4 mt-4 md:mt-0">
                    <span className={`text-xs font-medium capitalize ${getTypeColor(appointment.type)}`}>{appointment.type}</span>
                    {getStatusBadge(appointment.status)}
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline" className="border border-primary bg-[#121212] text-foreground hover:bg-primary-light hover:text-foreground" onClick={() => handleViewDetails(appointment)}>Ver Detalles</Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button size="icon" variant="ghost">
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem onClick={() => handleEditAppointment(appointment)}>
                            <Edit className="w-4 h-4 mr-2" />
                            Editar
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDeleteAppointment(appointment.id)} className="text-red-500">
                            <Trash2 className="w-4 h-4 mr-2" />
                            Eliminar
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                <Calendar className="w-12 h-12 mx-auto mb-4" />
                <h3 className="text-lg font-semibold">No hay citas para este día</h3>
                <p className="text-sm">Puedes agregar una nueva cita o cambiar de día.</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Agenda;
