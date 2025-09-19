import { create } from 'zustand';
import { toast } from '@/hooks/use-toast';
import { initialInvoices } from '@/lib/mock-data';

interface BillingState {
  invoices: any[];
  saveInvoice: (invoiceData: any, existingInvoiceId?: string) => void;
  deleteInvoice: (id: string) => void;
}

export const useBillingStore = create<BillingState>((set) => ({
  invoices: initialInvoices,
  saveInvoice: (invoiceData, existingInvoiceId) => {
    set((state) => {
      if (existingInvoiceId) {
        toast({
          title: "Factura actualizada",
          description: `La factura ${existingInvoiceId} ha sido actualizada.`,
        });
        return {
          invoices: state.invoices.map(inv =>
            inv.id === existingInvoiceId ? { ...inv, ...invoiceData } : inv
          ),
        };
      } else {
        const newInvoice = {
          ...invoiceData,
          id: `INV-${String(Date.now()).slice(-4)}`,
          date: new Date().toISOString().split('T')[0],
        };
        toast({
          title: "Factura creada",
          description: `La factura ${newInvoice.id} ha sido creada.`,
        });
        return {
          invoices: [newInvoice, ...state.invoices],
        };
      }
    });
  },
  deleteInvoice: (id) => {
    set((state) => ({
      invoices: state.invoices.filter(inv => inv.id !== id),
    }));
    toast({
      title: "Factura eliminada",
      description: `La factura ${id} ha sido eliminada.`,
    });
  },
}));
