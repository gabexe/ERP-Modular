
import { Settings, Building, Bell, Zap, User, Database } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useProfile } from "@/lib/useProfile";
import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { cleanDatabase } from "@/lib/cleanDatabase";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

const Configuracion = () => {
  const { toast } = useToast();
  const { profile, loading } = useProfile();
  const [fullName, setFullName] = useState(profile?.full_name || "");
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    const { error } = await supabase.from('profiles').update({ full_name: fullName }).eq('id', profile.id);
    setSaving(false);
    if (error) {
      toast({ title: 'Error', description: error.message });
    } else {
      toast({ title: 'Perfil actualizado', description: 'Tu nombre ha sido actualizado.' });
    }
  };

  if (loading) return null;

  return (
    <div className="space-y-6 fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <Settings className="w-7 h-7 text-primary" />
          Configuración
        </h1>
        <p className="text-muted-foreground mt-1">
          Ajusta las preferencias y configuraciones generales del sistema.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Column 1 */}
        <div className="lg:col-span-2 space-y-6">
          {/* Perfil de usuario */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                Mi Perfil
              </CardTitle>
              <CardDescription>
                Edita tu información personal.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Nombre completo</Label>
                <Input
                  value={fullName}
                  onChange={e => setFullName(e.target.value)}
                  placeholder="Nombre completo"
                  maxLength={40}
                />
              </div>
              <Button onClick={handleSave} disabled={saving}>
                {saving ? 'Guardando...' : 'Guardar Cambios'}
              </Button>
            </CardContent>
          </Card>
          {/* Company Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building className="w-5 h-5" />
                Datos de la Empresa
              </CardTitle>
              <CardDescription>
                Información de tu negocio que aparecerá en las facturas y otros documentos.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Nombre de la Empresa</Label>
                <p className="text-lg font-semibold">Mi Negocio SRL</p>
              </div>
              <div>
                <Label>CUIT</Label>
                <p className="text-lg font-semibold">30-12345678-9</p>
              </div>
              <div>
                <Label>Dirección</Label>
                <p className="text-lg font-semibold">Av. Siempre Viva 742, Springfield</p>
              </div>
              <Button 
                variant="outline" 
                onClick={() => toast({ title: "Función no disponible", description: "En desarrollo." })}
              >
                Editar Datos
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Column 2 */}
        <div className="space-y-6">
          {/* Notifications */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="w-5 h-5" />
                Notificaciones
              </CardTitle>
              <CardDescription>
                Gestiona cómo y cuándo recibes notificaciones.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="email-notifications">Notificaciones por Email</Label>
                <Switch id="email-notifications" defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="push-notifications">Notificaciones Push</Label>
                <Switch id="push-notifications" />
              </div>
            </CardContent>
          </Card>

          {/* Integrations */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="w-5 h-5" />
                Integraciones
              </CardTitle>
              <CardDescription>
                Conecta el ERP con otros servicios.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Google Calendar</Label>
                <p className="text-sm text-success font-medium">Conectado</p>
              </div>
              <div className="flex items-center justify-between">
                <Label>AFIP</Label>
                <p className="text-sm text-success font-medium">Conectado</p>
              </div>
              <Button 
                className="w-full" 
                variant="outline" 
                onClick={() => toast({ title: "Función no disponible", description: "En desarrollo." })}
              >
                Gestionar Integraciones
              </Button>
            </CardContent>
          </Card>

          {/* Database Maintenance */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="w-5 h-5" />
                Mantenimiento
              </CardTitle>
              <CardDescription>
                Herramientas de mantenimiento de datos.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" className="w-full">
                    Limpiar Base de Datos
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Esta acción eliminará todos tus registros de la base de datos, incluyendo productos, clientes, citas, facturas y proyectos.
                      Esta acción no se puede deshacer.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction onClick={cleanDatabase}>
                      Eliminar Todo
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Configuracion;
