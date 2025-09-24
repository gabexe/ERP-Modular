import { useState, useEffect, createContext, useContext } from 'react';
import { supabase } from './supabaseClient';

interface Permission {
  module: string;
  view: boolean;
  edit: boolean;
}

interface UserRole {
  id: string;
  userId: string;
  role: 'admin' | 'editor' | 'viewer';
  permissions: Permission[];
  ownerUserId: string;
}

interface Invitation {
  id: string;
  ownerProfile: {
    name: string;
    email: string;
    username: string;
  };
  role: 'editor' | 'viewer';
  permissions: Permission[];
}

interface RolesContextType {
  userRole: UserRole | null;
  loading: boolean;
  updateUserPermissions: (userId: string, permissions: Permission[]) => Promise<void>;
  getUsersWithAccess: () => Promise<any[]>;
  getInvitations: () => Promise<Invitation[]>;
  grantAccess: (userId: string, role: 'editor' | 'viewer') => Promise<void>;
  revokeAccess: (userId: string) => Promise<void>;
}

const RolesContext = createContext<RolesContextType | null>(null);

export function RolesProvider({ children }) {
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUserRole = async (userId: string) => {
    // Primero verificamos si el usuario es propietario de su cuenta
    const { data: ownerData } = await supabase
      .from('user_profiles')
      .select('id, owner_id')
      .eq('id', userId)
      .single();

    if (ownerData?.id === ownerData?.owner_id) {
      // El usuario es propietario, tiene rol de administrador
      setUserRole({
        id: userId,
        userId: userId,
        role: 'admin',
        ownerUserId: userId,
        permissions: [
          { module: 'dashboard', view: true, edit: true },
          { module: 'crm', view: true, edit: true },
          { module: 'agenda', view: true, edit: true },
          { module: 'inventario', view: true, edit: true },
          { module: 'facturacion', view: true, edit: true },
          { module: 'proyectos', view: true, edit: true },
          { module: 'reportes', view: true, edit: true },
          { module: 'usuarios', view: true, edit: true },
        ]
      });
      return;
    }

    // Si no es propietario, buscamos sus permisos asignados
    const { data: roleData } = await supabase
      .from('user_roles')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (roleData) {
      setUserRole(roleData);
    }
  };

  // Obtener todos los usuarios que tienen acceso a los datos del usuario actual
  const getUsersWithAccess = async () => {
    const { data: users } = await supabase
      .from('user_roles')
      .select(`
        id,
        user_id,
        role,
        permissions,
        user_profiles:user_id (
          name,
          email,
          username
        )
      `)
      .eq('owner_user_id', userRole?.userId);
    
    return users || [];
  };

  // Obtener todas las invitaciones recibidas por el usuario actual
  const getInvitations = async () => {
    const { data: invitations } = await supabase
      .from('user_roles')
      .select(`
        id,
        role,
        permissions,
        owner_profile:owner_user_id (
          name,
          email,
          username
        )
      `)
      .eq('user_id', userRole?.userId);

    return (invitations || []).map(inv => ({
      id: inv.id,
      ownerProfile: inv.owner_profile,
      role: inv.role,
      permissions: inv.permissions
    }));
  };

  // Actualizar permisos de un usuario
  const updateUserPermissions = async (userId: string, permissions: Permission[]) => {
    await supabase
      .from('user_roles')
      .update({ permissions })
      .eq('user_id', userId)
      .eq('owner_user_id', userRole?.userId);
  };

  // Otorgar acceso a un nuevo usuario
  const grantAccess = async (userId: string, role: 'editor' | 'viewer') => {
    const defaultPermissions = role === 'editor' ? 
      [
        { module: 'dashboard', view: true, edit: true },
        { module: 'crm', view: true, edit: true },
        { module: 'agenda', view: true, edit: true },
        { module: 'inventario', view: true, edit: true },
        { module: 'facturacion', view: true, edit: true },
        { module: 'proyectos', view: true, edit: true },
        { module: 'reportes', view: true, edit: false },
      ] : 
      [
        { module: 'dashboard', view: true, edit: false },
        { module: 'crm', view: true, edit: false },
        { module: 'agenda', view: true, edit: false },
        { module: 'inventario', view: true, edit: false },
        { module: 'facturacion', view: true, edit: false },
        { module: 'proyectos', view: true, edit: false },
        { module: 'reportes', view: true, edit: false },
      ];

    await supabase
      .from('user_roles')
      .insert({
        user_id: userId,
        owner_user_id: userRole?.userId,
        role,
        permissions: defaultPermissions
      });
  };

  // Revocar acceso a un usuario
  const revokeAccess = async (userId: string) => {
    await supabase
      .from('user_roles')
      .delete()
      .eq('user_id', userId)
      .eq('owner_user_id', userRole?.userId);
  };

  useEffect(() => {
    const session = supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        fetchUserRole(session.user.id);
      }
      setLoading(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        fetchUserRole(session.user.id);
      } else {
        setUserRole(null);
      }
    });

    return () => {
      listener?.subscription.unsubscribe();
    };
  }, []);

  return (
    <RolesContext.Provider value={{ 
      userRole, 
      loading, 
      updateUserPermissions, 
      getUsersWithAccess,
        getInvitations,
      grantAccess,
      revokeAccess
    }}>
      {children}
    </RolesContext.Provider>
  );
}

export function useRoles() {
  const context = useContext(RolesContext);
  if (!context) {
    throw new Error('useRoles must be used within a RolesProvider');
  }
  return context;
}
