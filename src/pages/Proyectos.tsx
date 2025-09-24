import { useEffect } from "react";
import { FolderOpen, Plus, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useModalStore } from "@/store/useModalStore";
import { useProjectStore } from "@/store/useProjectStore";

const getStatusBadge = (status: string) => {
  switch (status) {
    case "en-progreso":
      return <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">En Progreso</Badge>;
    case "completado":
      return <Badge className="bg-green-500/20 text-green-400 border-green-500/30">Completado</Badge>;
    case "pendiente":
      return <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">Pendiente</Badge>;
    default:
      return <Badge variant="secondary">{status}</Badge>;
  }
};

const Proyectos = () => {
  const { projects, fetchProjects } = useProjectStore();
  const { openModal } = useModalStore();

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  return (
    <div className="space-y-6 fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <FolderOpen className="w-7 h-7 text-primary" />
            Seguimiento de Proyectos
          </h1>
          <p className="text-muted-foreground mt-1">
            Organiza y supervisa el progreso de tus trabajos.
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={() => {}}>
            <Filter className="w-4 h-4 mr-2" />
            Filtros
          </Button>
          <Button onClick={() => openModal('project')}>
            <Plus className="w-4 h-4 mr-2" />
            Nuevo Proyecto
          </Button>
        </div>
      </div>

      {/* Projects List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {projects.map((project) => (
          <Card key={project.id}>
            <CardHeader>
              <CardTitle className="flex justify-between items-start">
                <span>{project.name}</span>
                {getStatusBadge(project.status)}
              </CardTitle>
              <CardDescription>{project.client}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Progreso</span>
                  <span>{project.progress ?? 0}%</span>
                </div>
                <Progress value={project.progress ?? 0} className="h-2" />
                <div className="text-xs text-muted-foreground pt-2">
                  Fecha de Entrega: {project.due_date}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Proyectos;
