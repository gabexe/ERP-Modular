import { create } from 'zustand';
import { toast } from '@/hooks/use-toast';
import { initialProjects } from '@/lib/mock-data';

interface ProjectState {
  projects: any[];
  saveProject: (projectData: any, existingProjectId?: string) => void;
  deleteProject: (id: string) => void;
}

export const useProjectStore = create<ProjectState>((set) => ({
  projects: initialProjects,
  saveProject: (projectData, existingProjectId) => {
    set((state) => {
      if (existingProjectId) {
        toast({
          title: "Proyecto actualizado",
          description: `El proyecto ha sido actualizado.`,
        });
        return {
          projects: state.projects.map(p =>
            p.id === existingProjectId ? { ...p, ...projectData } : p
          ),
        };
      } else {
        const newProject = {
          ...projectData,
          id: `PROJ-${String(Date.now()).slice(-4)}`,
          status: "pendiente",
          progress: 0,
        };
        toast({
          title: "Proyecto creado",
          description: `El proyecto ${newProject.name} ha sido creado.`,
        });
        return {
          projects: [newProject, ...state.projects],
        };
      }
    });
  },
  deleteProject: (id) => {
    set((state) => ({
      projects: state.projects.filter(p => p.id !== id),
    }));
    toast({
      title: "Proyecto eliminado",
      description: `El proyecto ha sido eliminado.`,
    });
  },
}));
