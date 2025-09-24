import { useState } from "react";
import { Users, Plus, Search, Filter, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ClientCard } from "@/components/crm/ClientCard";
import { useToast } from "@/hooks/use-toast";
import { useModalStore } from "@/store/useModalStore";
import { useCrmStore } from "@/store/useCrmStore";

export default function CRM() {
  const [searchTerm, setSearchTerm] = useState("");
  const { openModal } = useModalStore();
  const { clients, deleteClient } = useCrmStore();
  const { toast } = useToast();

  const handleNewClient = () => {
    openModal('client');
  };

  const handleEditClient = (client: any) => {
    openModal('client', { client });
  };

  const filteredClients = clients.filter(client =>
    client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const activeClients = clients.filter(c => c.status === "activo").length;
  const prospects = clients.filter(c => c.status === "prospecto").length;

  return (
    <div className="space-y-4 md:space-y-6 fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 md:gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-foreground flex items-center gap-2">
            <Users className="w-6 h-6 md:w-7 md:h-7 text-primary" />
            Gestión de Clientes
          </h1>
          <p className="text-sm md:text-base text-muted-foreground mt-1">
            Administra tu cartera de clientes y prospectos
          </p>
        </div>
        
        <div className="flex gap-2 md:gap-3 w-full sm:w-auto">
          <Button variant="outline" size="sm" className="flex-1 sm:flex-none" onClick={() => toast({ title: "Función no disponible", description: "En desarrollo." })}>
            <Download className="w-4 h-4 mr-1 md:mr-2" />
            <span className="hidden sm:inline">Exportar</span>
          </Button>
          <Button size="sm" className="flex-1 sm:flex-none" onClick={handleNewClient}>
            <Plus className="w-4 h-4 mr-1 md:mr-2" />
            <span className="hidden sm:inline">Nuevo</span>
            <span className="sm:hidden">Cliente</span>
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 md:gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2 md:left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Buscar clientes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8 md:pl-10 text-sm md:text-base h-9 md:h-10"
          />
        </div>
        <Button variant="outline" size="sm" onClick={() => toast({ title: "Función no disponible", description: "En desarrollo." })}>
          <Filter className="w-4 h-4 mr-1 md:mr-2" />
          Filtros
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6">
        <Card>
          <CardHeader className="pb-2 px-4 md:px-6">
            <CardTitle className="text-xs md:text-sm font-medium text-muted-foreground">
              Total Clientes
            </CardTitle>
          </CardHeader>
          <CardContent className="px-4 md:px-6">
            <div className="text-xl md:text-2xl font-bold text-foreground">{clients.length}</div>
            <p className="text-xs text-success">+12% este mes</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2 px-4 md:px-6">
            <CardTitle className="text-xs md:text-sm font-medium text-muted-foreground">
              Clientes Activos
            </CardTitle>
          </CardHeader>
          <CardContent className="px-4 md:px-6">
            <div className="text-xl md:text-2xl font-bold text-foreground">{activeClients}</div>
            <p className="text-xs text-warning">+5% este mes</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2 px-4 md:px-6">
            <CardTitle className="text-xs md:text-sm font-medium text-muted-foreground">
              Nuevos Prospectos
            </CardTitle>
          </CardHeader>
          <CardContent className="px-4 md:px-6">
            <div className="text-xl md:text-2xl font-bold text-foreground">{prospects}</div>
            <p className="text-xs text-info">+8% este mes</p>
          </CardContent>
        </Card>
      </div>

      {/* Clients Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
        {filteredClients.map((client) => (
          <ClientCard
            key={client.id}
            client={client}
            onEdit={handleEditClient}
            onDelete={deleteClient}
          />
        ))}
      </div>

    </div>
  );
}
