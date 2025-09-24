import { useState, useEffect } from "react";
import { useRoles } from "@/lib/useRoles";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { InvitationsSection } from "@/components/users/InvitationsSection";
import { Users, UserPlus, Trash2 } from "lucide-react";

interface User {
  id: string;
  user_id: string;
  role: 'editor' | 'viewer';
  permissions: Array<{
    module: string;
    view: boolean;
    edit: boolean;
  }>;
  profiles: {
    name: string;
    email: string;
  };
}

export default function UsuariosPage() {
  const { getUsersWithAccess, grantAccess, revokeAccess, updateUserPermissions } = useRoles();
  const { toast } = useToast();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [newUserEmail, setNewUserEmail] = useState("");
  const [isAddingUser, setIsAddingUser] = useState(false);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const usersData = await getUsersWithAccess();
      setUsers(usersData);
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudieron cargar los usuarios",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleAddUser = async () => {
    try {
      setIsAddingUser(true);
      // Si el identificador no contiene @, asumimos que es un nombre de usuario y construimos el email
      const identifier = newUserEmail.includes('@') ? newUserEmail : `${newUserEmail}@nometria.erp`;
      await grantAccess(identifier, 'viewer');
      await fetchUsers();
      setNewUserEmail("");
      toast({
        title: "Usuario agregado",
        description: "Se ha otorgado acceso al usuario correctamente",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo agregar al usuario",
        variant: "destructive",
      });
    } finally {
      setIsAddingUser(false);
    }
  };

  const handleRemoveUser = async (userId: string) => {
    try {
      await revokeAccess(userId);
      await fetchUsers();
      toast({
        title: "Usuario eliminado",
        description: "Se ha revocado el acceso al usuario correctamente",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo eliminar al usuario",
        variant: "destructive",
      });
    }
  };

  const handleUpdatePermissions = async (user: User) => {
    try {
      await updateUserPermissions(user.user_id, user.permissions);
      await fetchUsers();
      toast({
        title: "Permisos actualizados",
        description: "Los permisos del usuario se han actualizado correctamente",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudieron actualizar los permisos",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container mx-auto py-6 space-y-8">
      {/* Sección de invitaciones recibidas */}
      <InvitationsSection />

      {/* Sección de gestión de usuarios */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Gestión de Usuarios</h1>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <UserPlus className="w-4 h-4 mr-2" />
              Agregar Usuario
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Agregar nuevo usuario</DialogTitle>
              <DialogDescription>
                Ingresa el correo electrónico del usuario al que deseas dar acceso
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="identifier">Email o nombre de usuario</Label>
                <Input
                  id="identifier"
                  type="text"
                  placeholder="usuario@ejemplo.com o nombre_usuario"
                  value={newUserEmail}
                  onChange={(e) => setNewUserEmail(e.target.value)}
                />
                <p className="text-sm text-muted-foreground">
                  Puedes ingresar un correo electrónico o un nombre de usuario
                </p>
              </div>
              <Button
                onClick={handleAddUser}
                disabled={isAddingUser || !newUserEmail}
                className="w-full"
              >
                {isAddingUser ? "Agregando..." : "Agregar Usuario"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Usuario</TableHead>
              <TableHead>Rol</TableHead>
              <TableHead>Permisos</TableHead>
              <TableHead>Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>
                  <div className="flex flex-col">
                    <span className="font-medium">{user.profiles.name}</span>
                    <span className="text-sm text-muted-foreground">
                      {user.profiles.email}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  {user.role === 'editor' ? 'Editor' : 'Visualizador'}
                </TableCell>
                <TableCell>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm">
                        Configurar Permisos
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>Permisos de Usuario</DialogTitle>
                        <DialogDescription>
                          Configura los permisos para {user.profiles.name}
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        {user.permissions.map((permission, index) => (
                          <div key={permission.module} className="flex items-center gap-4 p-2 rounded bg-muted/50">
                            <div className="flex-1">
                              <h4 className="font-medium capitalize">{permission.module}</h4>
                            </div>
                            <div className="flex gap-4">
                              <div className="flex items-center gap-2">
                                <Checkbox
                                  id={`view-${permission.module}`}
                                  checked={permission.view}
                                  onCheckedChange={(checked) => {
                                    const newPermissions = [...user.permissions];
                                    newPermissions[index] = {
                                      ...permission,
                                      view: checked as boolean,
                                    };
                                    const updatedUser = { ...user, permissions: newPermissions };
                                    setUsers(users.map(u => u.id === user.id ? updatedUser : u));
                                  }}
                                />
                                <Label htmlFor={`view-${permission.module}`}>Ver</Label>
                              </div>
                              <div className="flex items-center gap-2">
                                <Checkbox
                                  id={`edit-${permission.module}`}
                                  checked={permission.edit}
                                  onCheckedChange={(checked) => {
                                    const newPermissions = [...user.permissions];
                                    newPermissions[index] = {
                                      ...permission,
                                      edit: checked as boolean,
                                    };
                                    const updatedUser = { ...user, permissions: newPermissions };
                                    setUsers(users.map(u => u.id === user.id ? updatedUser : u));
                                  }}
                                />
                                <Label htmlFor={`edit-${permission.module}`}>Editar</Label>
                              </div>
                            </div>
                          </div>
                        ))}
                        <Button
                          className="w-full"
                          onClick={() => handleUpdatePermissions(user)}
                        >
                          Guardar Cambios
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </TableCell>
                <TableCell>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleRemoveUser(user.user_id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
