import { create } from 'zustand';
import { toast } from 'sonner';
import { initialAppointments } from '@/lib/mock-data';

interface AgendaState {
  appointments: any[];
  saveAppointment: (appointmentData: any, existingAppointmentId?: number) => void;
  deleteAppointment: (id: number) => void;
}

export const useAgendaStore = create<AgendaState>((set) => ({
  appointments: initialAppointments,
  saveAppointment: (appointmentData, existingAppointmentId) => {
    set((state) => {
      const { date, time, ...rest } = appointmentData;
      const [year, month, day] = date.split('-').map(Number);
      const [hours, minutes] = time.split(':').map(Number);
      const combinedDate = new Date(year, month - 1, day, hours, minutes);

      if (existingAppointmentId) {
        toast.success("Cita actualizada con éxito");
        return {
          appointments: state.appointments.map(app =>
            app.id === existingAppointmentId ? { ...app, ...rest, date: combinedDate } : app
          ),
        };
      } else {
        const newAppointment = {
          ...rest,
          id: Date.now(),
          date: combinedDate,
          duration: "1h",
          type: "reunión",
          status: "pendiente",
        };
        toast.success("Cita creada con éxito");
        return {
          appointments: [...state.appointments, newAppointment],
        };
      }
    });
  },
  deleteAppointment: (id) => {
    set((state) => ({
      appointments: state.appointments.filter(app => app.id !== id),
    }));
    toast.success("Cita eliminada");
  },
}));
