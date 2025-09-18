import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import CRM from "./pages/CRM";
import Inventario from "./pages/Inventario";
import Agenda from "./pages/Agenda";
import NotFound from "./pages/NotFound";
import { MainLayout } from "@/components/layout/MainLayout";
import Facturacion from "./pages/Facturacion";
import Proyectos from "./pages/Proyectos";
import Reportes from "./pages/Reportes";
import Configuracion from "./pages/Configuracion";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route element={<MainLayout />}>
            <Route path="/" element={<Index />} />
            <Route path="/crm" element={<CRM />} />
            <Route path="/inventario" element={<Inventario />} />
            <Route path="/agenda" element={<Agenda />} />
            <Route path="/facturacion" element={<Facturacion />} />
            <Route path="/proyectos" element={<Proyectos />} />
            <Route path="/reportes" element={<Reportes />} />
            <Route path="/configuracion" element={<Configuracion />} />
          </Route>
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
