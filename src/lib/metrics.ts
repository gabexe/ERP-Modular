import { type Client } from "@/store/useCrmStore";
import { type Invoice } from "@/store/useBillingStore";
import { type Product } from "@/store/useInventoryStore";

export function calculateCRMMetrics(clients: Client[]) {
  const now = new Date();
  const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const firstDayOfPrevMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);

  const activeClients = clients.filter(c => c.status === "activo").length;
  const prospects = clients.filter(c => c.status === "prospecto").length;

  const currentMonthClients = clients.filter(c => new Date(c.created_at) >= firstDayOfMonth).length;
  const prevMonthClients = clients.filter(c => {
    const date = new Date(c.created_at);
    return date >= firstDayOfPrevMonth && date < firstDayOfMonth;
  }).length;

  const percentageChange = prevMonthClients === 0 
    ? 'N/A' 
    : ((currentMonthClients - prevMonthClients) / prevMonthClients) * 100;

  return {
    totalClients: clients.length,
    activeClients,
    prospects,
    monthGrowth: percentageChange === 'N/A' ? 'N/A' : Math.round(percentageChange * 10) / 10
  };
}

export function calculateInventoryMetrics(products: Product[]) {
  const lowStockProducts = products.filter(p => p.stock <= p.minStock).length;
  const totalValue = products.reduce((sum, p) => sum + (p.stock * p.price), 0);
  const totalProducts = products.length;
  const criticalStock = products.filter(p => p.stock <= p.minStock * 0.5).length;

  return {
    totalProducts,
    lowStockProducts,
    criticalStock,
    totalValue: Math.round(totalValue * 100) / 100
  };
}

export function calculateReportMetrics(invoices: Invoice[], clients: Client[]) {
  const now = new Date();
  const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const firstDayOfPrevMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);

  // Ingresos totales
  const currentMonthInvoices = invoices.filter(i => new Date(i.date) >= firstDayOfMonth);
  const prevMonthInvoices = invoices.filter(i => {
    const date = new Date(i.date);
    return date >= firstDayOfPrevMonth && date < firstDayOfMonth;
  });

  const currentMonthRevenue = currentMonthInvoices.reduce((sum, i) => sum + i.total, 0);
  const prevMonthRevenue = prevMonthInvoices.reduce((sum, i) => sum + i.total, 0);
  const revenueChange = prevMonthRevenue === 0 
    ? 'N/A' 
    : ((currentMonthRevenue - prevMonthRevenue) / prevMonthRevenue) * 100;

  // Clientes nuevos
  const currentMonthClients = clients.filter(c => new Date(c.created_at) >= firstDayOfMonth).length;
  const prevMonthClients = clients.filter(c => {
    const date = new Date(c.created_at);
    return date >= firstDayOfPrevMonth && date < firstDayOfMonth;
  }).length;
  const clientsChange = prevMonthClients === 0 
    ? 'N/A' 
    : ((currentMonthClients - prevMonthClients) / prevMonthClients) * 100;

  // Ventas
  const currentMonthSales = currentMonthInvoices.length;
  const prevMonthSales = prevMonthInvoices.length;
  const salesChange = prevMonthSales === 0 
    ? 'N/A' 
    : ((currentMonthSales - prevMonthSales) / prevMonthSales) * 100;

  // Tasa de conversión (prospectos a clientes)
  const currentProspects = clients.filter(c => 
    c.status === "prospecto" && new Date(c.created_at) >= firstDayOfMonth
  ).length;
  const currentConverted = clients.filter(c =>
    c.status === "activo" && new Date(c.created_at) >= firstDayOfMonth
  ).length;
  const prevProspects = clients.filter(c => {
    const date = new Date(c.created_at);
    return c.status === "prospecto" && date >= firstDayOfPrevMonth && date < firstDayOfMonth;
  }).length;
  const prevConverted = clients.filter(c => {
    const date = new Date(c.created_at);
    return c.status === "activo" && date >= firstDayOfPrevMonth && date < firstDayOfMonth;
  }).length;

  const currentConversionRate = currentProspects === 0 
    ? 0 
    : (currentConverted / currentProspects) * 100;
  const prevConversionRate = prevProspects === 0 
    ? 0 
    : (prevConverted / prevProspects) * 100;
  const conversionChange = prevConversionRate === 0 
    ? 'N/A' 
    : ((currentConversionRate - prevConversionRate) / prevConversionRate) * 100;

  return {
    revenue: {
      total: Math.round(currentMonthRevenue * 100) / 100,
      change: revenueChange === 'N/A' ? 'N/A' : Math.round(revenueChange * 10) / 10
    },
    newClients: {
      total: currentMonthClients,
      change: clientsChange === 'N/A' ? 'N/A' : Math.round(clientsChange * 10) / 10
    },
    sales: {
      total: currentMonthSales,
      change: salesChange === 'N/A' ? 'N/A' : Math.round(salesChange * 10) / 10
    },
    conversionRate: {
      rate: Math.round(currentConversionRate * 10) / 10,
      change: conversionChange === 'N/A' ? 'N/A' : Math.round(conversionChange * 10) / 10
    }
  };
}
