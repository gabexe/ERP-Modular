import { create } from 'zustand';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabaseClient';

export interface Invoice {
  id: string;
  client: string;
  date: string;
  total: number;
  status: string;
  items: any[];
  user_id: string;
  created_at: string;
  updated_at: string;
}

interface BillingState {
  invoices: Invoice[];
  loading: boolean;
  error: string | null;
  fetchInvoices: () => Promise<void>;
  saveInvoice: (invoiceData: Partial<Invoice>, existingInvoiceId?: string) => Promise<void>;
  deleteInvoice: (id: string) => Promise<void>;
}

export const useBillingStore = create<BillingState>((set) => ({
  invoices: [],
  loading: false,
  error: null,

  fetchInvoices: async () => {
    set({ loading: true });
    try {
      const { data: invoices, error } = await supabase
        .from('invoices')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      set({ invoices, error: null });
    } catch (error) {
      set({ error: error.message });
      toast({
        title: "Error",
        description: "No se pudieron cargar las facturas.",
      });
    } finally {
      set({ loading: false });
    }
  },

  saveInvoice: async (invoiceData, existingInvoiceId) => {
    set({ loading: true });
    try {
      const { data: { user } } = await supabase.auth.getUser();
      const now = new Date().toISOString();

      if (existingInvoiceId) {
        const { error } = await supabase
          .from('invoices')
          .update({ 
            ...invoiceData,
            updated_at: now
          })
          .eq('id', existingInvoiceId)
          .eq('user_id', user?.id);

        if (error) throw error;
        
        set(state => ({
          invoices: state.invoices.map(invoice =>
            invoice.id === existingInvoiceId ? { ...invoice, ...invoiceData, updated_at: now } : invoice
          )
        }));

        toast({
          title: "Factura actualizada",
          description: `La factura ${existingInvoiceId} ha sido actualizada.`,
        });
      } else {
        const newInvoice = {
          ...invoiceData,
          id: `INV-${String(Date.now()).slice(-4)}`,
          date: now.split('T')[0],
          user_id: user?.id,
          created_at: now,
          updated_at: now
        };

        const { data, error } = await supabase
          .from('invoices')
          .insert([newInvoice])
          .select()
          .single();

        if (error) throw error;
        
        set(state => ({
          invoices: [data, ...state.invoices]
        }));

        toast({
          title: "Factura creada",
          description: `La factura ${data.id} ha sido creada.`,
        });
      }
    } catch (error) {
      set({ error: error.message });
      toast({
        title: "Error",
        description: "No se pudo guardar la factura.",
      });
    } finally {
      set({ loading: false });
    }
  },

  deleteInvoice: async (id) => {
    set({ loading: true });
    try {
      const { error } = await supabase
        .from('invoices')
        .delete()
        .eq('id', id)
        .eq('user_id', (await supabase.auth.getUser()).data.user?.id);

      if (error) throw error;

      set(state => ({
        invoices: state.invoices.filter(invoice => invoice.id !== id)
      }));

      toast({
        title: "Factura eliminada",
        description: `La factura ${id} ha sido eliminada.`,
      });
    } catch (error) {
      set({ error: error.message });
      toast({
        title: "Error",
        description: "No se pudo eliminar la factura.",
      });
    } finally {
      set({ loading: false });
    }
  }
}));
