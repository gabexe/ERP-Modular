import { create } from 'zustand';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabaseClient';

export interface Client {
  id: number;
  name: string;
  email: string;
  phone: string;
  company: string;
  status: string;
  lastContact: string;
  address: string;
  notes: string;
  user_id: string;
  created_at: string;
  updated_at: string;
}

interface CrmState {
  clients: Client[];
  loading: boolean;
  error: string | null;
  fetchClients: () => Promise<void>;
  saveClient: (clientData: Partial<Client>, existingClientId?: number) => Promise<void>;
  deleteClient: (id: number) => Promise<void>;
}

export const useCrmStore = create<CrmState>((set) => ({
  clients: [],
  loading: false,
  error: null,

  fetchClients: async () => {
    set({ loading: true });
    try {
      const { data: clients, error } = await supabase
        .from('clients')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      set({ clients, error: null });
    } catch (error) {
      set({ error: error.message });
      toast({
        title: "Error",
        description: "No se pudieron cargar los clientes.",
      });
    } finally {
      set({ loading: false });
    }
  },

  saveClient: async (clientData, existingClientId) => {
    set({ loading: true });
    try {
      const { data: { user } } = await supabase.auth.getUser();
      const now = new Date().toISOString();

      if (existingClientId) {
        const { error } = await supabase
          .from('clients')
          .update({ 
            ...clientData,
            updated_at: now
          })
          .eq('id', existingClientId)
          .eq('user_id', user?.id);

        if (error) throw error;
        
        set(state => ({
          clients: state.clients.map(client =>
            client.id === existingClientId ? { ...client, ...clientData, updated_at: now } : client
          )
        }));

        toast({
          title: "Cliente actualizado",
          description: "Los datos del cliente han sido actualizados.",
        });
      } else {
        const { data, error } = await supabase
          .from('clients')
          .insert([{ 
            ...clientData,
            user_id: user?.id,
            created_at: now,
            updated_at: now
          }])
          .select()
          .single();

        if (error) throw error;
        
        set(state => ({
          clients: [data, ...state.clients]
        }));

        toast({
          title: "Cliente creado",
          description: "El nuevo cliente ha sido agregado exitosamente.",
        });
      }
    } catch (error) {
      set({ error: error.message });
      toast({
        title: "Error",
        description: "No se pudo guardar el cliente.",
      });
    } finally {
      set({ loading: false });
    }
  },

  deleteClient: async (id) => {
    set({ loading: true });
    try {
      const { error } = await supabase
        .from('clients')
        .delete()
        .eq('id', id)
        .eq('user_id', (await supabase.auth.getUser()).data.user?.id);

      if (error) throw error;

      set(state => ({
        clients: state.clients.filter(client => client.id !== id)
      }));

      toast({
        title: "Cliente eliminado",
        description: "El cliente ha sido eliminado exitosamente.",
      });
    } catch (error) {
      set({ error: error.message });
      toast({
        title: "Error",
        description: "No se pudo eliminar el cliente.",
      });
    } finally {
      set({ loading: false });
    }
  }
}));
