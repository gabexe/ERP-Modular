import { useEffect, useState } from "react";
import { useRoles } from "@/lib/useRoles";
import { useToast } from "@/hooks/use-toast";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";

interface Invitation {
  id: string;
  ownerProfile: {
    name: string;
    email: string;
    username: string;
  };
  role: 'editor' | 'viewer';
  permissions: Array<{
    module: string;
    view: boolean;
    edit: boolean;
  }>;
}

export function InvitationsSection() {
  const { getInvitations } = useRoles();
  const { toast } = useToast();
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInvitations();
  }, []);

  const fetchInvitations = async () => {
    try {
      const data = await getInvitations();
      setInvitations(data);
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudieron cargar las invitaciones",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-4">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Invitaciones recibidas</CardTitle>
        <CardDescription>
          Empresas que te han dado acceso a sus datos
        </CardDescription>
      </CardHeader>
      <CardContent>
        {invitations.length === 0 ? (
          <p className="text-sm text-muted-foreground">No has recibido invitaciones aún.</p>
        ) : (
          <div className="space-y-4">
            {invitations.map((invitation) => (
              <div
                key={invitation.id}
                className="flex items-center justify-between p-4 rounded-lg border bg-card"
              >
                <div className="space-y-1">
                  <h4 className="font-medium">
                    {invitation.ownerProfile.name || invitation.ownerProfile.username}
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    {invitation.ownerProfile.email}
                  </p>
                  <div className="flex gap-2 mt-2">
                    <Badge variant={invitation.role === 'editor' ? "default" : "secondary"}>
                      {invitation.role === 'editor' ? 'Editor' : 'Visualizador'}
                    </Badge>
                    {invitation.permissions.map((perm) => 
                      perm.view && (
                        <Badge key={perm.module} variant="outline">
                          {perm.module}
                        </Badge>
                      )
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}