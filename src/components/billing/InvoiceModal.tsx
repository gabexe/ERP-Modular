import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { useState, useEffect } from "react";
import { useModalStore } from "@/store/useModalStore";
import { useBillingStore } from "@/store/useBillingStore";
import { useCrmStore } from "@/store/useCrmStore";
import { useToast } from "@/hooks/use-toast";
import { FileText, User, DollarSign, Calendar, Plus, Trash2, Building2, CreditCard } from "lucide-react";

interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export function InvoiceModal() {
  const { isOpen, type, data, closeModal } = useModalStore();
  const { saveInvoice } = useBillingStore();
  const { clients, fetchClients } = useCrmStore();
  const { toast } = useToast();

  // Datos básicos
  const [client, setClient] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [clientCUIT, setClientCUIT] = useState("");
  const [status, setStatus] = useState("pendiente");
  const [dueDate, setDueDate] = useState(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]);
  const [notes, setNotes] = useState("");
  
  // Items de factura
  const [items, setItems] = useState<InvoiceItem[]>([
    { id: "1", description: "", quantity: 1, unitPrice: 0, total: 0 }
  ]);

  // Configuración ARCA
  const [arcaEnabled, setArcaEnabled] = useState(false);
  const [invoiceType, setInvoiceType] = useState("FACTURA_B");
  const [paymentMethod, setPaymentMethod] = useState("efectivo");

  const isModalOpen = isOpen && type === 'invoice';
  const invoice = data?.invoice;

  useEffect(() => {
    if (isModalOpen) {
      fetchClients();
    }
  }, [isModalOpen, fetchClients]);

  useEffect(() => {
    if (invoice) {
      setClient(invoice.client);
      setStatus(invoice.status);
      setNotes(invoice.notes || "");
      if (invoice.items && invoice.items.length > 0) {
        setItems(invoice.items);
      }
    } else {
      setClient("");
      setClientEmail("");
      setClientCUIT("");
      setStatus("pendiente");
      setNotes("");
      setItems([{ id: "1", description: "", quantity: 1, unitPrice: 0, total: 0 }]);
    }
  }, [invoice, isModalOpen]);

  const handleClientChange = (clientId: string) => {
    const selectedClient = clients.find(c => c.id.toString() === clientId);
    if (selectedClient) {
      setClient(selectedClient.name);
      setClientEmail(selectedClient.email || "");
      // Aquí podrías tener un campo CUIT en el cliente
    } else {
      setClient(clientId);
    }
  };

  const addItem = () => {
    const newItem: InvoiceItem = {
      id: Date.now().toString(),
      description: "",
      quantity: 1,
      unitPrice: 0,
      total: 0
    };
    setItems([...items, newItem]);
  };

  const removeItem = (id: string) => {
    if (items.length > 1) {
      setItems(items.filter(item => item.id !== id));
    }
  };

  const updateItem = (id: string, field: keyof InvoiceItem, value: any) => {
    setItems(items.map(item => {
      if (item.id === id) {
        const updated = { ...item, [field]: value };
        if (field === 'quantity' || field === 'unitPrice') {
          updated.total = updated.quantity * updated.unitPrice;
        }
        return updated;
      }
      return item;
    }));
  };

  const calculateSubtotal = () => {
    return items.reduce((sum, item) => sum + item.total, 0);
  };

  const calculateIVA = () => {
    return calculateSubtotal() * 0.21; // IVA del 21%
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateIVA();
  };

  const handleSave = () => {
    // Validaciones
    if (!client) {
      toast({
        title: "Error de validación",
        description: "Debes seleccionar un cliente.",
        variant: "destructive"
      });
      return;
    }

    if (items.some(item => !item.description || item.quantity <= 0 || item.unitPrice < 0)) {
      toast({
        title: "Error de validación",
        description: "Todos los items deben tener descripción, cantidad y precio válidos.",
        variant: "destructive"
      });
      return;
    }

    if (arcaEnabled && !clientCUIT) {
      toast({
        title: "Error de validación",
        description: "Para integración con ARCA, debes proporcionar el CUIT del cliente.",
        variant: "destructive"
      });
      return;
    }

    const invoiceData = {
      client,
      clientEmail,
      clientCUIT,
      total: calculateTotal(),
      subtotal: calculateSubtotal(),
      iva: calculateIVA(),
      status,
      dueDate,
      notes,
      items,
      arcaEnabled,
      invoiceType,
      paymentMethod
    };

    saveInvoice(invoiceData, invoice?.id);
    closeModal();

    if (arcaEnabled) {
      toast({
        title: "Factura guardada",
        description: "La factura será enviada a ARCA para su registro electrónico.",
      });
    } else {
      toast({
        title: "Factura guardada",
        description: invoice ? "La factura ha sido actualizada." : "La factura ha sido creada.",
      });
    }
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={closeModal}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-primary" />
            {invoice ? "Editar Factura" : "Crear Nueva Factura"}
          </DialogTitle>
          <DialogDescription>
            Complete los detalles de la factura. Los campos con * son obligatorios.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Datos del Cliente */}
          <Card>
            <CardContent className="pt-6 space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <User className="w-4 h-4 text-primary" />
                <h3 className="font-semibold">Datos del Cliente</h3>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="client">Cliente *</Label>
                  <Select value={client} onValueChange={handleClientChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar cliente" />
                    </SelectTrigger>
                    <SelectContent>
                      {clients.map((c) => (
                        <SelectItem key={c.id} value={c.id.toString()}>
                          {c.name} {c.company && `- ${c.company}`}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="clientEmail">Email</Label>
                  <Input
                    id="clientEmail"
                    type="email"
                    value={clientEmail}
                    onChange={(e) => setClientEmail(e.target.value)}
                    placeholder="email@ejemplo.com"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="clientCUIT">CUIT/CUIL</Label>
                  <Input
                    id="clientCUIT"
                    value={clientCUIT}
                    onChange={(e) => setClientCUIT(e.target.value)}
                    placeholder="XX-XXXXXXXX-X"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dueDate">Fecha de Vencimiento</Label>
                  <Input
                    id="dueDate"
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Items de Factura */}
          <Card>
            <CardContent className="pt-6 space-y-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-primary" />
                  <h3 className="font-semibold">Items de Factura</h3>
                </div>
                <Button type="button" size="sm" onClick={addItem}>
                  <Plus className="w-4 h-4 mr-2" />
                  Agregar Item
                </Button>
              </div>

              <div className="space-y-3">
                {items.map((item, index) => (
                  <div key={item.id} className="grid grid-cols-12 gap-2 items-end p-3 border rounded-lg">
                    <div className="col-span-5">
                      <Label htmlFor={`desc-${item.id}`} className="text-xs">Descripción *</Label>
                      <Input
                        id={`desc-${item.id}`}
                        value={item.description}
                        onChange={(e) => updateItem(item.id, 'description', e.target.value)}
                        placeholder="Descripción del producto/servicio"
                      />
                    </div>
                    <div className="col-span-2">
                      <Label htmlFor={`qty-${item.id}`} className="text-xs">Cantidad *</Label>
                      <Input
                        id={`qty-${item.id}`}
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) => updateItem(item.id, 'quantity', parseFloat(e.target.value) || 0)}
                      />
                    </div>
                    <div className="col-span-2">
                      <Label htmlFor={`price-${item.id}`} className="text-xs">Precio Unit. *</Label>
                      <Input
                        id={`price-${item.id}`}
                        type="number"
                        step="0.01"
                        min="0"
                        value={item.unitPrice}
                        onChange={(e) => updateItem(item.id, 'unitPrice', parseFloat(e.target.value) || 0)}
                      />
                    </div>
                    <div className="col-span-2">
                      <Label className="text-xs">Total</Label>
                      <div className="h-10 flex items-center font-semibold">
                        ${item.total.toFixed(2)}
                      </div>
                    </div>
                    <div className="col-span-1">
                      <Button
                        type="button"
                        size="sm"
                        variant="ghost"
                        onClick={() => removeItem(item.id)}
                        disabled={items.length === 1}
                        className="text-destructive"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              <Separator />

              {/* Totales */}
              <div className="space-y-2 bg-muted/30 p-4 rounded-lg">
                <div className="flex justify-between text-sm">
                  <span>Subtotal:</span>
                  <span className="font-medium">${calculateSubtotal().toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>IVA (21%):</span>
                  <span className="font-medium">${calculateIVA().toFixed(2)}</span>
                </div>
                <Separator />
                <div className="flex justify-between text-lg font-bold">
                  <span>Total:</span>
                  <span className="text-primary">${calculateTotal().toFixed(2)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Integración ARCA */}
          <Card>
            <CardContent className="pt-6 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-primary" />
                  <h3 className="font-semibold">Integración ARCA (AFIP)</h3>
                  <Badge variant="secondary" className="ml-2">Facturación Electrónica</Badge>
                </div>
                <Switch
                  checked={arcaEnabled}
                  onCheckedChange={setArcaEnabled}
                />
              </div>

              {arcaEnabled && (
                <div className="grid grid-cols-2 gap-4 pt-2">
                  <div className="space-y-2">
                    <Label htmlFor="invoiceType">Tipo de Comprobante</Label>
                    <Select value={invoiceType} onValueChange={setInvoiceType}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="FACTURA_A">Factura A</SelectItem>
                        <SelectItem value="FACTURA_B">Factura B</SelectItem>
                        <SelectItem value="FACTURA_C">Factura C</SelectItem>
                        <SelectItem value="FACTURA_E">Factura E (Exportación)</SelectItem>
                        <SelectItem value="NOTA_CREDITO">Nota de Crédito</SelectItem>
                        <SelectItem value="NOTA_DEBITO">Nota de Débito</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="paymentMethod">Método de Pago</Label>
                    <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="efectivo">Efectivo</SelectItem>
                        <SelectItem value="transferencia">Transferencia Bancaria</SelectItem>
                        <SelectItem value="cheque">Cheque</SelectItem>
                        <SelectItem value="tarjeta_credito">Tarjeta de Crédito</SelectItem>
                        <SelectItem value="tarjeta_debito">Tarjeta de Débito</SelectItem>
                        <SelectItem value="mercado_pago">Mercado Pago</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}

              {arcaEnabled && (
                <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3 text-sm">
                  <p className="text-blue-700 dark:text-blue-400">
                    ℹ️ La factura será registrada electrónicamente en el sistema ARCA de AFIP. 
                    Asegúrate de tener configuradas tus credenciales de AFIP en Configuración.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Información Adicional */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="status">Estado de la Factura</Label>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="borrador">Borrador</SelectItem>
                  <SelectItem value="pendiente">Pendiente</SelectItem>
                  <SelectItem value="pagada">Pagada</SelectItem>
                  <SelectItem value="vencida">Vencida</SelectItem>
                  <SelectItem value="cancelada">Cancelada</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Notas / Observaciones</Label>
              <Textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Información adicional sobre la factura..."
                rows={3}
              />
            </div>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={closeModal}>
            Cancelar
          </Button>
          <Button onClick={handleSave} className="gap-2">
            <FileText className="w-4 h-4" />
            {invoice ? "Actualizar" : "Crear"} Factura
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
