import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState, useEffect } from "react";

export function InvoiceModal({ isOpen, onClose, onSave, invoice }: { isOpen: boolean; onClose: () => void; onSave: (data: any) => void; invoice: any }) {
  const [client, setClient] = useState("");
  const [total, setTotal] = useState("");
  const [status, setStatus] = useState("pendiente");

  useEffect(() => {
    if (invoice) {
      setClient(invoice.client);
      setTotal(invoice.total);
      setStatus(invoice.status);
    } else {
      setClient("");
      setTotal("");
      setStatus("pendiente");
    }
  }, [invoice, isOpen]);

  const handleSave = () => {
    const newInvoice = {
      id: invoice ? invoice.id : `INV-${String(Date.now()).slice(-3)}`,
      client,
      total: parseFloat(total),
      date: new Date().toISOString().split('T')[0],
      status,
    };
    onSave(newInvoice);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{invoice ? "Editar Factura" : "Crear Nueva Factura"}</DialogTitle>
          <DialogDescription>
            Completa los detalles de la factura.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="client" className="text-right">
              Cliente
            </Label>
            <Input id="client" value={client} onChange={(e) => setClient(e.target.value)} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="total" className="text-right">
              Monto
            </Label>
            <Input id="total" type="number" value={total} onChange={(e) => setTotal(e.target.value)} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="status" className="text-right">
              Estado
            </Label>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Seleccionar estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pagada">Pagada</SelectItem>
                <SelectItem value="pendiente">Pendiente</SelectItem>
                <SelectItem value="vencida">Vencida</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancelar</Button>
          <Button onClick={handleSave}>Guardar Factura</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
