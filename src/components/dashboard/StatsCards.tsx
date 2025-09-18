import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Users, Package, Receipt, Calendar } from "lucide-react";

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
  const stats = [
    {
      title: "Clientes Activos",
      value: "2,431",
      change: "+12.5%",
      trend: "up" as const,
      icon: <Users className="w-4 h-4" />
    },
    {
      title: "Productos en Stock",
      value: "1,245",
      change: "-2.1%",
      trend: "down" as const,
      icon: <Package className="w-4 h-4" />
    },
    {
      title: "Facturación Mensual",
      value: "$45,231",
      change: "+18.7%",
      trend: "up" as const,
      icon: <Receipt className="w-4 h-4" />
    },
    {
      title: "Citas Programadas",
      value: "127",
      change: "+7.3%",
      trend: "up" as const,
      icon: <Calendar className="w-4 h-4" />
    }
  ];

  return (
    <div className="grid-cards">
      {stats.map((stat, index) => (
        <StatCard key={index} {...stat} />
      ))}
    </div>
  );
}