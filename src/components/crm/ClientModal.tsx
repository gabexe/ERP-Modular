import { useEffect, useState } from "react";
import { X, Save, User, Mail, Phone, MapPin, Building, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useModalStore } from "@/store/useModalStore";
import { useCrmStore } from "@/store/useCrmStore";

export function ClientModal() {
  const { isOpen, type, data, closeModal } = useModalStore();
  const { saveClient } = useCrmStore();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    address: "",
    status: "activo",
    notes: "",
  });

  const isModalOpen = isOpen && type === 'client';
  const client = data?.client;

  useEffect(() => {
    if (client) {
      setFormData({
        name: client.name || "",
        email: client.email || "",
        phone: client.phone || "",
        company: client.company || "",
        address: client.address || "",
        status: client.status || "activo",
        notes: client.notes || "",
      });
    } else {
      setFormData({
        name: "",
        email: "",
        phone: "",
        company: "",
        address: "",
        status: "activo",
        notes: "",
      });
    }
  }, [client]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    saveClient(formData, client?.id);
    closeModal();
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={closeModal}>
      <DialogContent className="max-w-md mx-4 md:mx-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="w-5 h-5 text-primary" />
            {client ? "Editar Cliente" : "Nuevo Cliente"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-3 md:space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm md:text-base">Nombre Completo</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleChange("name", e.target.value)}
              placeholder="Juan Pérez"
              className="h-9 md:h-10"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm md:text-base">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleChange("email", e.target.value)}
                placeholder="juan@ejemplo.com"
                className="pl-10 h-9 md:h-10"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone" className="text-sm md:text-base">Teléfono</Label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => handleChange("phone", e.target.value)}
                placeholder="+1 234 567 8900"
                className="pl-10 h-9 md:h-10"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="company" className="text-sm md:text-base">Empresa</Label>
            <div className="relative">
              <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                id="company"
                value={formData.company}
                onChange={(e) => handleChange("company", e.target.value)}
                placeholder="Empresa SA"
                className="pl-10 h-9 md:h-10"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="address" className="text-sm md:text-base">Dirección</Label>
            <div className="relative">
              <MapPin className="absolute left-3 top-3 text-muted-foreground w-4 h-4" />
              <Textarea
                id="address"
                value={formData.address}
                onChange={(e) => handleChange("address", e.target.value)}
                placeholder="Calle Principal 123, Ciudad"
                className="pl-10 min-h-[60px] md:min-h-[80px]"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="status" className="text-sm md:text-base">Estado</Label>
            <Select value={formData.status} onValueChange={(value) => handleChange("status", value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="activo">Activo</SelectItem>
                <SelectItem value="inactivo">Inactivo</SelectItem>
                <SelectItem value="prospecto">Prospecto</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes" className="text-sm md:text-base">Notas</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => handleChange("notes", e.target.value)}
              placeholder="Notas adicionales sobre el cliente..."
              className="min-h-[60px] md:min-h-[80px]"
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <Button type="button" variant="outline" onClick={closeModal} className="flex-1 h-10 md:h-11">
              Cancelar
            </Button>
            <Button type="submit" className="flex-1 h-10 md:h-11">
              <Save className="w-4 h-4 mr-2" />
              Guardar
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}