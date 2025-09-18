import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Construction } from "lucide-react";

const UnderDevelopment = () => {
  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] p-4">
      <Card className="w-full max-w-md text-center">
        <CardHeader className="flex flex-col items-center">
          <Construction className="w-16 h-16 text-yellow-500 mb-4" />
          <CardTitle className="text-2xl font-bold">En Desarrollo</CardTitle>
          <CardDescription>
            Esta sección está actualmente en construcción. ¡Vuelve pronto para ver las novedades!
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Estamos trabajando arduamente para traer nuevas funcionalidades.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default UnderDevelopment;
