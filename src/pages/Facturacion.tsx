import { useState } from "react";
import { Receipt, Plus, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { InvoiceModal } from "@/components/billing/InvoiceModal";

const initialInvoices = [
  {
    id: "INV-001",
    client: "Tech Solutions SA",
    date: "2024-01-20",
    total: 1500.00,
    status: "pagada",
  },
  {
    id: "INV-002",
    client: "Construcciones Del Norte",
    date: "2024-01-22",
    total: 3200.50,
    status: "pendiente",
  },
  {
    id: "INV-003",
    client: "InnovaTech",
    date: "2024-01-25",
    total: 850.75,
    status: "vencida",
  },
];

const getStatusBadge = (status: string) => {
  switch (status) {
    case "pagada":
      return <Badge className="status-success">Pagada</Badge>;
    case "pendiente":
      return <Badge className="status-warning">Pendiente</Badge>;
    case "vencida":
      return <Badge className="status-error">Vencida</Badge>;
    default:
      return <Badge variant="secondary">{status}</Badge>;
  }
};

const Facturacion = () => {
  const { toast } = useToast();
  const [invoices, setInvoices] = useState(initialInvoices);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const handleSaveInvoice = (invoiceData: any) => {
    setInvoices(prev => [invoiceData, ...prev]);
    toast({
      title: "Factura Guardada",
      description: `La factura ${invoiceData.id} ha sido creada exitosamente.`,
    });
  };

  return (
    <div className="space-y-6 fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Receipt className="w-7 h-7 text-primary" />
            Facturación
          </h1>
          <p className="text-muted-foreground mt-1">
            Gestiona tus facturas y controla los pagos de tus clientes.
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={() => toast({ title: "Función no disponible", description: "Esta función estará disponible próximamente." })}>
            <Download className="w-4 h-4 mr-2" />
            Exportar
          </Button>
          <Button onClick={() => setIsModalOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Nueva Factura
          </Button>
        </div>
      </div>

      {/* Invoices List */}
      <Card>
        <CardHeader>
          <CardTitle>Facturas Recientes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {invoices.map((invoice) => (
              <div key={invoice.id} className="group flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/30 transition-colors">
                <div className="flex items-center gap-4">
                  <div>
                    <p className="font-semibold">{invoice.id}</p>
                    <p className="text-sm text-muted-foreground">{invoice.client}</p>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <p className="font-semibold">${invoice.total.toFixed(2)}</p>
                    <p className="text-sm text-muted-foreground">{invoice.date}</p>
                  </div>
                  {getStatusBadge(invoice.status)}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      
      <InvoiceModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveInvoice}
        invoice={null}
      />
    </div>
  );
};

export default Facturacion;
