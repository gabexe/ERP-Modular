
import { StatsCards } from "@/components/dashboard/StatsCards";
import { RecentActivities } from "@/components/dashboard/RecentActivities";
import { QuickActions } from "@/components/dashboard/QuickActions";

const Index = () => {
  return (
    <div className="space-y-4 md:space-y-6 fade-in">
      {/* Page Header */}
      <div className="space-y-1">
        <p className="text-sm md:text-base text-muted-foreground">
          Resumen general de tu negocio y acceso rápido a funciones principales
        </p>
      </div>

      {/* Stats Overview */}
      <StatsCards />

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
        <RecentActivities />
        <QuickActions />
      </div>
    </div>
  );
};

export default Index;
