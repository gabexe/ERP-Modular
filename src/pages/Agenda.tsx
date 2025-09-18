import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
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
import { toast } from "sonner";

import { initialAppointments } from "@/lib/mock-data";

const Agenda = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [appointments, setAppointments] = useState(initialAppointments);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isReadOnly, setIsReadOnly] = useState(false);
  const [editingAppointment, setEditingAppointment] = useState<any>(null);

  // State for the new appointment form
  const [title, setTitle] = useState("");
  const [client, setClient] = useState("");
  const [phone, setPhone] = useState("");
  const [location, setLocation] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [time, setTime] = useState("09:00");

  const filteredAppointments = useMemo(() => 
    appointments.filter(
      (appointment) => 
        appointment.date.toDateString() === currentDate.toDateString()
    ).sort((a, b) => a.date.getTime() - b.date.getTime()),
    [appointments, currentDate]
  );

  const handleNewAppointment = () => {
    setEditingAppointment(null);
    setIsReadOnly(false);
    setTitle("");
    setClient("");
    setPhone("");
    setLocation("");
    setDate(new Date().toISOString().split('T')[0]);
    setTime("09:00");
    setIsModalOpen(true);
  };

  const handleEditAppointment = (appointment: any) => {
    setEditingAppointment(appointment);
    setIsReadOnly(false);
    setTitle(appointment.title);
    setClient(appointment.client);
    setPhone(appointment.phone);
    setLocation(appointment.location);
    setDate(appointment.date.toISOString().split('T')[0]);
    setTime(appointment.date.toTimeString().slice(0, 5));
    setIsModalOpen(true);
  };

  const handleViewDetails = (appointment: any) => {
    localStorage.setItem("selectedAppointment", JSON.stringify(appointment));
    window.open("/cita-detalles", "_blank");
  };

  const handleSaveAppointment = () => {
    if (!title || !client) {
      // Basic validation
      toast.error("El título y el cliente son obligatorios.");
      return;
    }

    const [year, month, day] = date.split('-').map(Number);
    const [hours, minutes] = time.split(':').map(Number);
    const combinedDate = new Date(year, month - 1, day, hours, minutes);

    if (editingAppointment) {
      const updatedAppointment = {
        ...editingAppointment,
        title,
        client,
        phone,
        location,
        date: combinedDate,
      };
      setAppointments(prev => prev.map(app => app.id === editingAppointment.id ? updatedAppointment : app));
      toast.success("Cita actualizada con éxito");
    } else {
      const newAppointment = {
        id: appointments.length + 1,
        title,
        client,
        date: combinedDate,
        duration: "1h", // Default duration
        type: "reunión", // Default type
        status: "pendiente",
        location,
        phone,
      };
      setAppointments(prev => [...prev, newAppointment]);
      toast.success("Cita creada con éxito");
    }

    setIsModalOpen(false);
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
                      <Button size="sm" variant="outline" onClick={() => handleEditAppointment(appointment)}><Edit className="w-4 h-4" /></Button>
                      <Button size="sm" className="btn-primary" onClick={() => handleViewDetails(appointment)}>Ver Detalles</Button>
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

      {/* New/Edit Appointment Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{isReadOnly ? "Detalles de la Cita" : editingAppointment ? "Editar Cita" : "Crear Nueva Cita"}</DialogTitle>
            {!isReadOnly && <DialogDescription>Completa los detalles para {editingAppointment ? "actualizar la" : "agendar una nueva"} cita.</DialogDescription>}
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="title" className="text-right">Título</Label>
              <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} className="col-span-3" placeholder="Ej: Reunión de seguimiento" readOnly={isReadOnly}/>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="client" className="text-right">Cliente</Label>
              <Input id="client" value={client} onChange={(e) => setClient(e.target.value)} className="col-span-3" placeholder="Nombre del cliente" readOnly={isReadOnly}/>
            </div>
             <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="phone" className="text-right">Teléfono</Label>
              <Input id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} className="col-span-3" placeholder="+54 11..." readOnly={isReadOnly}/>
            </div>
             <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="location" className="text-right">Ubicación</Label>
              <Input id="location" value={location} onChange={(e) => setLocation(e.target.value)} className="col-span-3" placeholder="Dirección o 'Remoto'" readOnly={isReadOnly}/>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="date" className="text-right">Fecha</Label>
              <Input id="date" type="date" value={date} onChange={(e) => setDate(e.target.value)} className="col-span-3" readOnly={isReadOnly}/>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="time" className="text-right">Hora</Label>
              <Input id="time" type="time" value={time} onChange={(e) => setTime(e.target.value)} className="col-span-3" readOnly={isReadOnly}/>
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="secondary">{isReadOnly ? "Cerrar" : "Cancelar"}</Button>
            </DialogClose>
            {!isReadOnly && <Button type="submit" onClick={handleSaveAppointment}>Guardar Cita</Button>}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Agenda;
