import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Users, Package, Receipt, Calendar } from "lucide-react";
import { useCrmStore } from "@/store/useCrmStore";
import { useInventoryStore } from "@/store/useInventoryStore";
import { useBillingStore } from "@/store/useBillingStore";
import { useAgendaStore } from "@/store/useAgendaStore";

interface StatCardProps {
  title: string;
  value: string;
  change: string;
  trend: "up" | "down";
  icon: React.ReactNode;
}

function StatCard({ title, value, change, trend, icon }: StatCardProps) {
  const TrendIcon = trend === "up" ? TrendingUp : TrendingDown;
  const trendColor = trend === "up" ? "text-success" : "text-error";

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
  const { clients } = useCrmStore();
  const { products } = useInventoryStore();
  const { invoices } = useBillingStore();
  const { appointments } = useAgendaStore();

  const activeClients = clients.filter(c => c.status === 'activo').length;
  const totalStock = products.reduce((sum, p) => sum + p.stock, 0);

  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getYear();

  const monthlyRevenue = invoices
    .filter(inv => {
      const invDate = new Date(inv.date);
      return (
        inv.status === 'pagada' &&
        invDate.getMonth() === currentMonth &&
        invDate.getYear() === currentYear
      );
    })
    .reduce((sum, inv) => sum + inv.total, 0);

  const todayAppointments = appointments.filter(app => {
    const appDate = new Date(app.date);
    return appDate.toDateString() === now.toDateString();
  }).length;

  const stats: StatCardProps[] = [
    {
      title: "Clientes Activos",
      value: activeClients.toLocaleString(),
      change: "+12.5%",
      trend: "up" as const,
      icon: <Users className="w-4 h-4" />
    },
    {
      title: "Productos en Stock",
      value: totalStock.toLocaleString(),
      change: "-2.1%",
      trend: "down" as const,
      icon: <Package className="w-4 h-4" />
    },
    {
      title: "Facturación Mensual",
      value: `${monthlyRevenue.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      change: "+18.7%",
      trend: "up" as const,
      icon: <Receipt className="w-4 h-4" />
    },
    {
      title: "Citas para Hoy",
      value: todayAppointments.toString(),
      change: "+7.3%",
      trend: "up" as const,
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