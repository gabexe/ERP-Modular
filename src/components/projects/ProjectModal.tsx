import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState, useEffect } from "react";

export function ProjectModal({ isOpen, onClose, onSave, project }: { isOpen: boolean; onClose: () => void; onSave: (data: any) => void; project: any }) {
  const [name, setName] = useState("");
  const [client, setClient] = useState("");
  const [dueDate, setDueDate] = useState("");

  useEffect(() => {
    if (project) {
      setName(project.name);
      setClient(project.client);
      setDueDate(project.dueDate);
    } else {
      setName("");
      setClient("");
      setDueDate("");
    }
  }, [project, isOpen]);

  const handleSave = () => {
    const newProject = {
      id: project ? project.id : `PROJ-${String(Date.now()).slice(-3)}`,
      name,
      client,
      dueDate,
      status: "pendiente",
      progress: 0,
    };
    onSave(newProject);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{project ? "Editar Proyecto" : "Crear Nuevo Proyecto"}</DialogTitle>
          <DialogDescription>
            Completa los detalles del proyecto.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Nombre
            </Label>
            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="client" className="text-right">
              Cliente
            </Label>
            <Input id="client" value={client} onChange={(e) => setClient(e.target.value)} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="dueDate" className="text-right">
              Fecha Entrega
            </Label>
            <Input id="dueDate" type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} className="col-span-3" />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancelar</Button>
          <Button onClick={handleSave}>Guardar Proyecto</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
