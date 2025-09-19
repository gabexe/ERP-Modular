import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState, useEffect } from "react";
import { useModalStore } from "@/store/useModalStore";
import { useAgendaStore } from "@/store/useAgendaStore";
import { toast } from "sonner";

export function AppointmentModal() {
  const { isOpen, type, data, closeModal } = useModalStore();
  const { saveAppointment } = useAgendaStore();

  const [title, setTitle] = useState("");
  const [client, setClient] = useState("");
  const [phone, setPhone] = useState("");
  const [location, setLocation] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [time, setTime] = useState("09:00");

  const isModalOpen = isOpen && type === 'appointment';
  const appointment = data?.appointment;

  useEffect(() => {
    if (appointment) {
      setTitle(appointment.title);
      setClient(appointment.client);
      setPhone(appointment.phone);
      setLocation(appointment.location);
      setDate(appointment.date.toISOString().split('T')[0]);
      setTime(appointment.date.toTimeString().slice(0, 5));
    } else {
      setTitle("");
      setClient("");
      setPhone("");
      setLocation("");
      setDate(new Date().toISOString().split('T')[0]);
      setTime("09:00");
    }
  }, [appointment, isModalOpen]);

  const handleSave = () => {
    if (!title || !client) {
      toast.error("El título y el cliente son obligatorios.");
      return;
    }
    saveAppointment({ title, client, phone, location, date, time }, appointment?.id);
    closeModal();
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={closeModal}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{appointment ? "Editar Cita" : "Crear Nueva Cita"}</DialogTitle>
          <DialogDescription>Completa los detalles para {appointment ? "actualizar la" : "agendar una nueva"} cita.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="title" className="text-right">Título</Label>
            <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} className="col-span-3" placeholder="Ej: Reunión de seguimiento" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="client" className="text-right">Cliente</Label>
            <Input id="client" value={client} onChange={(e) => setClient(e.target.value)} className="col-span-3" placeholder="Nombre del cliente" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="phone" className="text-right">Teléfono</Label>
            <Input id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} className="col-span-3" placeholder="+54 11..." />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="location" className="text-right">Ubicación</Label>
            <Input id="location" value={location} onChange={(e) => setLocation(e.target.value)} className="col-span-3" placeholder="Dirección o 'Remoto'" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="date" className="text-right">Fecha</Label>
            <Input id="date" type="date" value={date} onChange={(e) => setDate(e.target.value)} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="time" className="text-right">Hora</Label>
            <Input id="time" type="time" value={time} onChange={(e) => setTime(e.target.value)} className="col-span-3" />
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="secondary">Cancelar</Button>
          </DialogClose>
          <Button type="submit" onClick={handleSave}>Guardar Cita</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}