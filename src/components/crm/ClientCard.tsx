import { useState } from "react";
import { MoreHorizontal, Edit, Trash2, Phone, Mail, MapPin, Building } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface Client {
  id: number;
  name: string;
  email: string;
  phone: string;
  company: string;
  status: string;
  lastContact: string;
  address?: string;
  notes?: string;
}

interface ClientCardProps {
  client: Client;
  onEdit: (client: Client) => void;
  onDelete: (id: number) => void;
}

export function ClientCard({ client, onEdit, onDelete }: ClientCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "activo": return "bg-green-500/20 text-green-400 border-green-500/30";
      case "inactivo": return "bg-red-500/20 text-red-400 border-red-500/30";
      case "prospecto": return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <Card className="group hover:shadow-elegant transition-all duration-200 hover:border-primary/20">
      <CardHeader className="pb-2 md:pb-3 px-4 md:px-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2 md:gap-3">
            <Avatar className="w-10 h-10 md:w-12 md:h-12">
              <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                {getInitials(client.name)}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="text-sm md:text-base font-semibold text-card-foreground truncate">{client.name}</h3>
              <p className="text-xs md:text-sm text-muted-foreground truncate">{client.company}</p>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row items-end sm:items-center gap-1 sm:gap-2">
            <Badge className={getStatusColor(client.status)} variant="secondary">
              {client.status}
            </Badge>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <MoreHorizontal className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onEdit(client)}>
                  <Edit className="w-4 h-4 mr-2" />
                  Editar
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => onDelete(client.id)}
                  className="text-destructive"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Eliminar
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-2 md:space-y-3 px-4 md:px-6">
        <div className="flex items-center gap-2 text-xs md:text-sm text-muted-foreground">
          <Mail className="w-4 h-4" />
          <span className="truncate">{client.email}</span>
        </div>
        
        <div className="flex items-center gap-2 text-xs md:text-sm text-muted-foreground">
          <Phone className="w-4 h-4" />
          <span>{client.phone}</span>
        </div>

        {client.address && (
          <div className="flex items-center gap-2 text-xs md:text-sm text-muted-foreground">
            <MapPin className="w-4 h-4" />
            <span className="truncate">{client.address}</span>
          </div>
        )}

        <div className="pt-2 border-t border-border">
          <p className="text-xs text-muted-foreground">
            Último contacto: {new Date(client.lastContact).toLocaleDateString('es-ES')}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}