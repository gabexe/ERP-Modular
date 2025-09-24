import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Users, Package, Receipt, Calendar } from "lucide-react";
import { useCrmStore } from "@/store/useCrmStore";
import { useInventoryStore } from "@/store/useInventoryStore";
import { useBillingStore } from "@/store/useBillingStore";
import { useAgendaStore } from "@/store/useAgendaStore";
import { getMonthDateRange, getPreviousMonthDateRange, calculatePercentageChange } from "@/lib/statsUtils";
import { useEffect } from "react";

interface StatCardProps {
  title: string;
  value: string;
  change: string;
  trend: "up" | "down";
  icon: React.ReactNode;
  isLoading?: boolean;
}

function StatCard({ title, value, change, trend, icon, isLoading }: StatCardProps) {
  const TrendIcon = trend === "up" ? TrendingUp : TrendingDown;
  const trendColor = trend === "up" ? "text-success" : "text-error";

  if (isLoading) {
    return (
      <Card className="card-gradient">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            {title}
          </CardTitle>
          <div className="text-muted-foreground">
            {icon}
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-8 w-24 animate-pulse bg-muted rounded"></div>
          <div className="flex items-center text-xs mt-1">
            <div className="h-3 w-16 animate-pulse bg-muted rounded"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="card-gradient">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <div className="text-muted-foreground">
          {icon}
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <div className="flex items-center text-xs mt-1">
          <TrendIcon className={`w-3 h-3 mr-1 ${trendColor}`} />
          <span className={trendColor}>{change}</span>
          <span className="text-muted-foreground ml-1">vs mes anterior</span>
        </div>
      </CardContent>
    </Card>
  );
}

export function StatsCards() {
  const { clients, fetchClients } = useCrmStore();
  const { products, fetchProducts } = useInventoryStore();
  const { invoices, fetchInvoices } = useBillingStore();
  const { appointments, fetchAppointments } = useAgendaStore();

  useEffect(() => {
    fetchClients();
    fetchProducts();
    fetchInvoices();
    fetchAppointments();
  }, [fetchClients, fetchProducts, fetchInvoices, fetchAppointments]);

  // Clientes activos
  const currentActiveClients = clients.filter(c => c.status === 'activo').length;
  const previousActiveClients = clients.filter(c => {
    const createdAt = new Date(c.created_at);
    const { firstDay, lastDay } = getPreviousMonthDateRange();
    return c.status === 'activo' && createdAt >= firstDay && createdAt <= lastDay;
  }).length;
  const clientsChange = calculatePercentageChange(currentActiveClients, previousActiveClients);

  // Stock total
  const currentStock = products.reduce((sum, p) => sum + p.stock, 0);
  const previousStock = products.reduce((sum, p) => {
    const updatedAt = new Date(p.updated_at);
    const { firstDay, lastDay } = getPreviousMonthDateRange();
    return sum + (updatedAt >= firstDay && updatedAt <= lastDay ? p.stock : 0);
  }, 0);
  const stockChange = calculatePercentageChange(currentStock, previousStock);

  // Facturación mensual
  const { firstDay: currentMonthStart, lastDay: currentMonthEnd } = getMonthDateRange();
  const { firstDay: prevMonthStart, lastDay: prevMonthEnd } = getPreviousMonthDateRange();

  const currentMonthRevenue = invoices
    .filter(inv => {
      const invDate = new Date(inv.date);
      return inv.status === 'pagada' && invDate >= currentMonthStart && invDate <= currentMonthEnd;
    })
    .reduce((sum, inv) => sum + inv.total, 0);

  const previousMonthRevenue = invoices
    .filter(inv => {
      const invDate = new Date(inv.date);
      return inv.status === 'pagada' && invDate >= prevMonthStart && invDate <= prevMonthEnd;
    })
    .reduce((sum, inv) => sum + inv.total, 0);

  const revenueChange = calculatePercentageChange(currentMonthRevenue, previousMonthRevenue);

  // Citas del día
  const today = new Date();
  const todayAppointments = appointments.filter(app => {
    const appDate = new Date(app.date);
    return appDate.toDateString() === today.toDateString();
  }).length;

  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayAppointments = appointments.filter(app => {
    const appDate = new Date(app.date);
    return appDate.toDateString() === yesterday.toDateString();
  }).length;

  const appointmentsChange = calculatePercentageChange(todayAppointments, yesterdayAppointments);

  const stats: StatCardProps[] = [
    {
      title: "Clientes Activos",
      value: currentActiveClients.toLocaleString(),
      change: `${clientsChange.value}%`,
      trend: clientsChange.trend,
      icon: <Users className="w-4 h-4" />
    },
    {
      title: "Productos en Stock",
      value: currentStock.toLocaleString(),
      change: `${stockChange.value}%`,
      trend: stockChange.trend,
      icon: <Package className="w-4 h-4" />
    },
    {
      title: "Facturación Mensual",
      value: `$${currentMonthRevenue.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      change: `${revenueChange.value}%`,
      trend: revenueChange.trend,
      icon: <Receipt className="w-4 h-4" />
    },
    {
      title: "Citas para Hoy",
      value: todayAppointments.toString(),
      change: `${appointmentsChange.value}%`,
      trend: appointmentsChange.trend,
      icon: <Calendar className="w-4 h-4" />
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
      {stats.map((stat, index) => (
        <StatCard key={index} {...stat} />
      ))}
    </div>
  );
}
