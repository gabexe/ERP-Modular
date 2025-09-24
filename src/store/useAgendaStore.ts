import { create } from 'zustand';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabaseClient';

interface Appointment {
  id: number;
  title: string;
  client: string;
  date: Date;
  duration: string;
  type: string;
  status: string;
  location: string;
  phone: string;
  user_id: string;
  created_at: string;
  updated_at: string;
}

interface AgendaState {
  appointments: Appointment[];
  loading: boolean;
  error: string | null;
  fetchAppointments: () => Promise<void>;
  saveAppointment: (appointmentData: any, existingAppointmentId?: number) => Promise<void>;
  deleteAppointment: (id: number) => Promise<void>;
}

export const useAgendaStore = create<AgendaState>((set) => ({
  appointments: [],
  loading: false,
  error: null,

  fetchAppointments: async () => {
    set({ loading: true });
    try {
      const { data: appointments, error } = await supabase
        .from('appointments')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Convertir las fechas string a objetos Date
      const appointmentsWithDates = appointments.map(app => ({
        ...app,
        date: new Date(app.date)
      }));

      set({ appointments: appointmentsWithDates, error: null });
    } catch (error) {
      set({ error: error.message });
      toast({
        title: "Error",
        description: "No se pudieron cargar las citas.",
      });
    } finally {
      set({ loading: false });
    }
  },

  saveAppointment: async (appointmentData, existingAppointmentId) => {
    set({ loading: true });
    try {
      const { date, time, ...rest } = appointmentData;
      const [year, month, day] = date.split('-').map(Number);
      const [hours, minutes] = time.split(':').map(Number);
      const combinedDate = new Date(year, month - 1, day, hours, minutes);
      const now = new Date().toISOString();
      const { data: { user } } = await supabase.auth.getUser();

      if (existingAppointmentId) {
        const { error } = await supabase
          .from('appointments')
          .update({ 
            ...rest,
            date: combinedDate.toISOString(),
            updated_at: now
          })
          .eq('id', existingAppointmentId)
          .eq('user_id', user?.id);

        if (error) throw error;
        
        set(state => ({
          appointments: state.appointments.map(app =>
            app.id === existingAppointmentId 
              ? { ...app, ...rest, date: combinedDate, updated_at: now }
              : app
          )
        }));

        toast({
          title: "Cita actualizada",
          description: "La cita ha sido actualizada exitosamente.",
        });
      } else {
        const newAppointment = {
          ...rest,
          date: combinedDate.toISOString(),
          duration: "1h",
          type: "reunión",
          status: "pendiente",
          user_id: user?.id,
          created_at: now,
          updated_at: now
        };

        const { data, error } = await supabase
          .from('appointments')
          .insert([newAppointment])
          .select()
          .single();

        if (error) throw error;

        // Convertir la fecha string a objeto Date
        const appointmentWithDate = {
          ...data,
          date: new Date(data.date)
        };
        
        set(state => ({
          appointments: [appointmentWithDate, ...state.appointments]
        }));

        toast({
          title: "Cita creada",
          description: "La nueva cita ha sido agregada exitosamente.",
        });
      }
    } catch (error) {
      set({ error: error.message });
      toast({
        title: "Error",
        description: "No se pudo guardar la cita.",
      });
    } finally {
      set({ loading: false });
    }
  },

  deleteAppointment: async (id) => {
    set({ loading: true });
    try {
      const { error } = await supabase
        .from('appointments')
        .delete()
        .eq('id', id)
        .eq('user_id', (await supabase.auth.getUser()).data.user?.id);

      if (error) throw error;

      set(state => ({
        appointments: state.appointments.filter(app => app.id !== id)
      }));

      toast({
        title: "Cita eliminada",
        description: "La cita ha sido eliminada exitosamente.",
      });
    } catch (error) {
      set({ error: error.message });
      toast({
        title: "Error",
        description: "No se pudo eliminar la cita.",
      });
    } finally {
      set({ loading: false });
    }
  }
}));
