import { create } from 'zustand';
import { toast } from '@/hooks/use-toast';

const initialClients = [
    {
      id: 1,
      name: "María González",
      email: "maria@ejemplo.com",
      phone: "+1 234 567 8901",
      company: "Tech Solutions SA",
      status: "activo",
      lastContact: "2024-01-15",
      address: "Av. Tecnológica 123, Ciudad Tech",
      notes: "Cliente VIP, requiere atención especializada"
    },
    {
      id: 2,
      name: "Carlos Rodríguez",
      email: "carlos@empresa.com",
      phone: "+1 234 567 8902",
      company: "Construcciones Del Norte",
      status: "prospecto",
      lastContact: "2024-01-14",
      address: "Zona Industrial Norte",
      notes: "Interesado en proyecto de gran escala"
    },
    {
      id: 3,
      name: "Ana López",
      email: "ana@negocio.com",
      phone: "+1 234 567 8903",
      company: "Servicios Integrales",
      status: "inactivo",
      lastContact: "2024-01-10",
      address: "Centro Comercial Plaza",
      notes: "Pausó servicios temporalmente"
    },
    {
      id: 4,
      name: "Roberto Silva",
      email: "roberto@innovatech.com",
      phone: "+1 234 567 8904",
      company: "InnovaTech",
      status: "activo",
      lastContact: "2024-01-16",
      address: "Parque Tecnológico 456",
      notes: "Cliente frecuente, muy satisfecho"
    },
    {
      id: 5,
      name: "Laura Martínez",
      email: "laura@startup.co",
      phone: "+1 234 567 8905",
      company: "Startup Co",
      status: "prospecto",
      lastContact: "2024-01-13",
      address: "Hub de Innovación",
      notes: "Startup en crecimiento, gran potencial"
    },
    {
      id: 6,
      name: "Pedro Jiménez",
      email: "pedro@consultora.net",
      phone: "+1 234 567 8906",
      company: "Consultora Empresarial",
      status: "activo",
      lastContact: "2024-01-17",
      address: "Torre Empresarial 789",
      notes: "Consultor con múltiples proyectos"
    }
  ];

interface CrmState {
  clients: any[];
  saveClient: (clientData: any, existingClientId?: number) => void;
  deleteClient: (id: number) => void;
}

export const useCrmStore = create<CrmState>((set) => ({
  clients: initialClients,
  saveClient: (clientData, existingClientId) => {
    set((state) => {
      if (existingClientId) {
        toast({
          title: "Cliente actualizado",
          description: "Los datos del cliente han sido actualizados.",
        });
        return {
          clients: state.clients.map(client =>
            client.id === existingClientId ? { ...client, ...clientData } : client
          ),
        };
      } else {
        toast({
          title: "Cliente creado",
          description: "El nuevo cliente ha sido agregado exitosamente.",
        });
        return {
          clients: [...state.clients, { ...clientData, id: Date.now() }],
        };
      }
    });
  },
  deleteClient: (id) => {
    set((state) => ({
      clients: state.clients.filter(client => client.id !== id),
    }));
    toast({
      title: "Cliente eliminado",
      description: "El cliente ha sido eliminado exitosamente.",
    });
  },
}));
