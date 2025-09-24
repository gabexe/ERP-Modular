import { supabase } from './supabaseClient';
import { toast } from '@/hooks/use-toast';

export const cleanDatabase = async () => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Usuario no autenticado');

    // Eliminar todos los registros de las tablas principales para el usuario actual
    const tables = ['products', 'clients', 'appointments', 'invoices', 'projects'];
    
    for (const table of tables) {
      const { error } = await supabase
        .from(table)
        .delete()
        .eq('user_id', user.id);
      
      if (error) {
        console.error(`Error al limpiar la tabla ${table}:`, error);
        throw error;
      }
    }

    toast({
      title: "Base de datos limpiada",
      description: "Se han eliminado todos los registros correctamente.",
    });

    // Refrescar los stores
    window.location.reload();

  } catch (error) {
    console.error('Error al limpiar la base de datos:', error);
    toast({
      title: "Error",
      description: "No se pudo limpiar la base de datos. " + error.message,
      variant: "destructive"
    });
  }
};
