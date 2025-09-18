import { useState } from "react";
import { Users, Plus, Search, Filter, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ClientCard } from "@/components/crm/ClientCard";
import { ClientModal } from "@/components/crm/ClientModal";
import { useToast } from "@/hooks/use-toast";

export default function CRM() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<any>(null);
  const { toast } = useToast();

  // Mock data para clientes
  const [clients, setClients] = useState([
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
  ]);

  const handleNewClient = () => {
    setEditingClient(null);
    setIsModalOpen(true);
  };

  const handleEditClient = (client: any) => {
    setEditingClient(client);
    setIsModalOpen(true);
  };

  const handleDeleteClient = (id: number) => {
    setClients(prev => prev.filter(client => client.id !== id));
    toast({
      title: "Cliente eliminado",
      description: "El cliente ha sido eliminado exitosamente.",
    });
  };

  const handleSaveClient = (clientData: any) => {
    if (editingClient) {
      setClients(prev => prev.map(client => 
        client.id === editingClient.id ? clientData : client
      ));
      toast({
        title: "Cliente actualizado",
        description: "Los datos del cliente han sido actualizados.",
      });
    } else {
      setClients(prev => [...prev, clientData]);
      toast({
        title: "Cliente creado",
        description: "El nuevo cliente ha sido agregado exitosamente.",
      });
    }
  };

  const filteredClients = clients.filter(client =>
    client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const activeClients = clients.filter(c => c.status === "activo").length;
  const prospects = clients.filter(c => c.status === "prospecto").length;

  return (
    <div className="space-y-6 fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Users className="w-7 h-7 text-primary" />
            Gestión de Clientes
          </h1>
          <p className="text-muted-foreground mt-1">
            Administra tu cartera de clientes y prospectos
          </p>
        </div>
        
        <div className="flex gap-3">
          <Button variant="outline" onClick={() => toast({ title: "Función no disponible", description: "En desarrollo." })}>
            <Download className="w-4 h-4 mr-2" />
            Exportar
          </Button>
          <Button onClick={handleNewClient}>
            <Plus className="w-4 h-4 mr-2" />
            Nuevo Cliente
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Buscar clientes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button variant="outline" onClick={() => toast({ title: "Función no disponible", description: "En desarrollo." })}>
          <Filter className="w-4 h-4 mr-2" />
          Filtros
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Clientes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{clients.length}</div>
            <p className="text-xs text-success">+12% este mes</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Clientes Activos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{activeClients}</div>
            <p className="text-xs text-warning">+5% este mes</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Nuevos Prospectos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{prospects}</div>
            <p className="text-xs text-info">+8% este mes</p>
          </CardContent>
        </Card>
      </div>

      {/* Clients Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredClients.map((client) => (
          <ClientCard
            key={client.id}
            client={client}
            onEdit={handleEditClient}
            onDelete={handleDeleteClient}
          />
        ))}
      </div>

      {/* Modal */}
      <ClientModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        client={editingClient}
        onSave={handleSaveClient}
      />
    </div>
  );
}
