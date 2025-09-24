import { BarChart3, TrendingUp, Users, DollarSign } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCrmStore } from "@/store/useCrmStore";
import { useBillingStore } from "@/store/useBillingStore";
import { useEffect, useMemo } from "react";
import { calculateReportMetrics } from "@/lib/metrics";

const Reportes = () => {
  const { clients, fetchClients } = useCrmStore();
  const { invoices, fetchInvoices } = useBillingStore();

  useEffect(() => {
    fetchClients();
    fetchInvoices();
  }, [fetchClients, fetchInvoices]);

  const metrics = useMemo(() => calculateReportMetrics(invoices, clients), [invoices, clients]);
  return (
    <div className="space-y-6 fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <BarChart3 className="w-7 h-7 text-primary" />
          Reportes y Estadísticas
        </h1>
        <p className="text-muted-foreground mt-1">
          Visualiza el rendimiento y las métricas clave de tu negocio.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ingresos Totales</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${metrics.revenue.total.toLocaleString()}</div>
            <p className={`text-xs ${metrics.revenue.change !== 'N/A' && metrics.revenue.change >= 0 ? 'text-success' : 'text-destructive'}`}>
              {metrics.revenue.change === 'N/A' ? 'N/A' : `${metrics.revenue.change >= 0 ? '+' : ''}${metrics.revenue.change}% desde el mes pasado`}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Clientes Nuevos</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+{metrics.newClients.total}</div>
            <p className={`text-xs ${metrics.newClients.change !== 'N/A' && metrics.newClients.change >= 0 ? 'text-success' : 'text-destructive'}`}>
              {metrics.newClients.change === 'N/A' ? 'N/A' : `${metrics.newClients.change >= 0 ? '+' : ''}${metrics.newClients.change}% desde el mes pasado`}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ventas</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+{metrics.sales.total}</div>
            <p className={`text-xs ${metrics.sales.change !== 'N/A' && metrics.sales.change >= 0 ? 'text-success' : 'text-destructive'}`}>
              {metrics.sales.change === 'N/A' ? 'N/A' : `${metrics.sales.change >= 0 ? '+' : ''}${metrics.sales.change}% desde el mes pasado`}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tasa de Conversión</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.conversionRate.rate}%</div>
            <p className={`text-xs ${metrics.conversionRate.change !== 'N/A' && metrics.conversionRate.change >= 0 ? 'text-success' : 'text-destructive'}`}>
              {metrics.conversionRate.change === 'N/A' ? 'N/A' : `${metrics.conversionRate.change >= 0 ? '+' : ''}${metrics.conversionRate.change}% desde el mes pasado`}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Chart Placeholder */}
      <Card>
        <CardHeader>
          <CardTitle>Análisis de Ventas Mensuales</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-96 flex items-center justify-center text-muted-foreground">
            <p>En desarrollo.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Reportes;
