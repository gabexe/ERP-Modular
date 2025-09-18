import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { User, MapPin, Phone, Calendar } from "lucide-react";

const CitaDetalles = () => {
  const [appointment, setAppointment] = useState<any>(null);

  useEffect(() => {
    const storedAppointment = localStorage.getItem("selectedAppointment");
    if (storedAppointment) {
      const parsedAppointment = JSON.parse(storedAppointment, (key, value) => {
        if (key === 'date') {
          return new Date(value);
        }
        return value;
      });
      setAppointment(parsedAppointment);
    }
  }, []);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "confirmada": return <Badge className="bg-green-500/20 text-green-400 border-green-500/30">Confirmada</Badge>;
      case "pendiente": return <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">Pendiente</Badge>;
      case "en-curso": return <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">En Curso</Badge>;
      case "cancelada": return <Badge className="bg-red-500/20 text-red-400 border-red-500/30">Cancelada</Badge>;
      default: return <Badge variant="secondary">{status}</Badge>;
    }
  };

  if (!appointment) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-lg text-muted-foreground">No se encontró la cita.</p>
      </div>
    );
  }

  return (
    <div className="p-8 fade-in">
      <Card className="max-w-2xl mx-auto card-gradient">
        <CardHeader>
          <CardTitle className="flex justify-between items-center">
            <span>{appointment.title}</span>
            {getStatusBadge(appointment.status)}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center"><User className="w-5 h-5 mr-3" /> <span>{appointment.client}</span></div>
          <div className="flex items-center"><Phone className="w-5 h-5 mr-3" /> <span>{appointment.phone}</span></div>
          <div className="flex items-center"><MapPin className="w-5 h-5 mr-3" /> <span>{appointment.location}</span></div>
          <div className="flex items-center"><Calendar className="w-5 h-5 mr-3" /> <span>{appointment.date.toLocaleString('es-AR')}</span></div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CitaDetalles;
