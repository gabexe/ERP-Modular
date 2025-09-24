import { create } from 'zustand';
import { supabase } from '@/lib/supabaseClient';
import { toast } from '@/hooks/use-toast';

interface Project {
  id: string;
  name: string;
  client: string;
  status: string;
  progress: number;
  due_date: string;
  description: string;
  user_id: string;
  created_at: string;
  updated_at: string;
}

interface ProjectState {
  projects: Project[];
  loading: boolean;
  error: string | null;
  fetchProjects: () => Promise<void>;
  saveProject: (projectData: Partial<Project>, existingProjectId?: string) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;
}

export const useProjectStore = create<ProjectState>((set, get) => ({
  projects: [],
  loading: false,
  error: null,

  fetchProjects: async () => {
    set({ loading: true });
    try {
      const { data: projects, error } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      set({ projects, error: null });
    } catch (error) {
      set({ error: error.message });
      toast({
        title: "Error",
        description: "No se pudieron cargar los proyectos.",
      });
    } finally {
      set({ loading: false });
    }
  },

  saveProject: async (projectData, existingProjectId) => {
    set({ loading: true });
    try {
      const { data: { user } } = await supabase.auth.getUser();
      const now = new Date().toISOString();

      if (existingProjectId) {
        const { error } = await supabase
          .from('projects')
          .update({ 
            ...projectData,
            updated_at: now 
          })
          .eq('id', existingProjectId)
          .eq('user_id', user?.id);

        if (error) throw error;
        
        set(state => ({
          projects: state.projects.map(project =>
            project.id === existingProjectId ? { ...project, ...projectData, updated_at: now } : project
          )
        }));

        toast({
          title: "Proyecto actualizado",
          description: "El proyecto ha sido actualizado exitosamente.",
        });
      } else {
        const newProject = {
          ...projectData,
          user_id: user?.id,
          created_at: now,
          updated_at: now
        };

        const { data, error } = await supabase
          .from('projects')
          .insert([newProject])
          .select()
          .single();

        if (error) throw error;
        
        set(state => ({
          projects: [data, ...state.projects]
        }));

        toast({
          title: "Proyecto creado",
          description: "El nuevo proyecto ha sido creado exitosamente.",
        });
      }
    } catch (error) {
      set({ error: error.message });
      toast({
        title: "Error",
        description: "No se pudo guardar el proyecto.",
      });
    } finally {
      set({ loading: false });
    }
  },

  deleteProject: async (id) => {
    set({ loading: true });
    try {
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', id)
        .eq('user_id', (await supabase.auth.getUser()).data.user?.id);

      if (error) throw error;

      set(state => ({
        projects: state.projects.filter(project => project.id !== id)
      }));

      toast({
        title: "Proyecto eliminado",
        description: "El proyecto ha sido eliminado exitosamente.",
      });
    } catch (error) {
      set({ error: error.message });
      toast({
        title: "Error",
        description: "No se pudo eliminar el proyecto.",
      });
    } finally {
      set({ loading: false });
    }
  }
}));
