import { useState } from "react";
import { Check, X, Zap, Star, Crown, Gift, ArrowRight, Shield, Users, HardDrive, Headphones, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";

interface PlanFeature {
  name: string;
  included: boolean;
  details?: string;
}

interface Plan {
  id: string;
  name: string;
  icon: React.ElementType;
  description: string;
  priceMonthly: number;
  priceYearly: number;
  popular?: boolean;
  badge?: string;
  features: PlanFeature[];
  limits: {
    users: string;
    clients: string;
    invoices: string;
    storage: string;
    support: string;
  };
  modules: string[];
  color: string;
}

const plans: Plan[] = [
  {
    id: "free",
    name: "Gratis",
    icon: Gift,
    description: "Ideal para probar la plataforma",
    priceMonthly: 0,
    priceYearly: 0,
    badge: "Prueba",
    color: "from-gray-400 to-gray-600",
    limits: {
      users: "1 usuario",
      clients: "Hasta 50 clientes",
      invoices: "1 factura/mes",
      storage: "100 MB",
      support: "Base de conocimientos"
    },
    modules: ["CRM", "Agenda", "Facturación"],
    features: [
      { name: "1 Usuario", included: true },
      { name: "50 Clientes máx.", included: true },
      { name: "5 Citas/mes", included: true },
      { name: "1 Factura/mes", included: true },
      { name: "100 MB almacenamiento", included: true },
      { name: "Integraciones básicas", included: true },
      { name: "Inventario", included: false },
      { name: "Proyectos", included: false },
      { name: "Reportes avanzados", included: false },
      { name: "Soporte prioritario", included: false }
    ]
  },
  {
    id: "basic",
    name: "Básico",
    icon: Zap,
    description: "Perfecto para freelancers y monotributistas",
    priceMonthly: 9.99,
    priceYearly: 99.99,
    color: "from-blue-400 to-blue-600",
    limits: {
      users: "1 usuario",
      clients: "Hasta 150 clientes",
      invoices: "Facturas ilimitadas",
      storage: "1 GB",
      support: "Soporte estándar"
    },
    modules: ["CRM", "Agenda", "Facturación"],
    features: [
      { name: "1 Usuario", included: true },
      { name: "150 Clientes máx.", included: true },
      { name: "Citas ilimitadas", included: true },
      { name: "Facturas ilimitadas", included: true },
      { name: "1 GB almacenamiento", included: true },
      { name: "Integraciones completas", included: true },
      { name: "Exportación PDF/CSV", included: true },
      { name: "Inventario", included: false },
      { name: "Proyectos", included: false },
      { name: "Reportes avanzados", included: false }
    ]
  },
  {
    id: "standard",
    name: "Estándar",
    icon: Star,
    description: "Ideal para pequeñas empresas",
    priceMonthly: 29.99,
    priceYearly: 299.99,
    popular: true,
    badge: "Popular",
    color: "from-purple-400 to-purple-600",
    limits: {
      users: "Hasta 5 usuarios",
      clients: "Hasta 500 clientes",
      invoices: "Facturas ilimitadas",
      storage: "10 GB",
      support: "Soporte prioritario"
    },
    modules: ["CRM", "Agenda", "Facturación", "Inventario"],
    features: [
      { name: "Hasta 5 Usuarios", included: true },
      { name: "500 Clientes máx.", included: true },
      { name: "Citas ilimitadas", included: true },
      { name: "Facturas ilimitadas", included: true },
      { name: "Inventario completo", included: true },
      { name: "10 GB almacenamiento", included: true },
      { name: "Reportes básicos", included: true },
      { name: "Integraciones completas", included: true },
      { name: "Soporte prioritario", included: true },
      { name: "Proyectos", included: false }
    ]
  },
  {
    id: "premium",
    name: "Premium",
    icon: Crown,
    description: "Solución completa para empresas",
    priceMonthly: 79.99,
    priceYearly: 799.99,
    badge: "Completo",
    color: "from-amber-400 to-amber-600",
    limits: {
      users: "Usuarios ilimitados",
      clients: "Clientes ilimitados",
      invoices: "Todo ilimitado",
      storage: "100 GB",
      support: "Soporte 24/7"
    },
    modules: ["CRM", "Agenda", "Facturación", "Inventario", "Proyectos", "Reportes"],
    features: [
      { name: "Usuarios ilimitados", included: true },
      { name: "Clientes ilimitados", included: true },
      { name: "Gestión de proyectos", included: true },
      { name: "Reportes avanzados", included: true },
      { name: "100 GB almacenamiento", included: true },
      { name: "Integraciones completas", included: true },
      { name: "API para desarrolladores", included: true },
      { name: "Soporte 24/7", included: true },
      { name: "Capacitación incluida", included: true },
      { name: "Gestor de cuenta dedicado", included: true }
    ]
  }
];

const addOns = [
  {
    id: "storage",
    name: "Almacenamiento Extra",
    description: "50 GB adicionales",
    price: 9.99,
    icon: HardDrive
  },
  {
    id: "training",
    name: "Capacitación Premium",
    description: "2 sesiones personalizadas/mes",
    price: 49.99,
    icon: Users
  },
  {
    id: "support",
    name: "Soporte Prioritario",
    description: "Respuesta garantizada en 2h",
    price: 29.99,
    icon: Headphones
  },
  {
    id: "consulting",
    name: "Consultoría Mensual",
    description: "4 horas de asesoría/mes",
    price: 99.99,
    icon: TrendingUp
  }
];

export default function Suscripciones() {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly");
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const { toast } = useToast();

  const handleSelectPlan = (planId: string) => {
    setSelectedPlan(planId);
    const plan = plans.find(p => p.id === planId);
    toast({
      title: "Plan seleccionado",
      description: `Has seleccionado el plan ${plan?.name}. Próximamente podrás continuar con el pago.`,
    });
  };

  const calculateSavings = (monthly: number, yearly: number) => {
    if (monthly === 0) return 0;
    const yearlyFromMonthly = monthly * 12;
    return ((yearlyFromMonthly - yearly) / yearlyFromMonthly * 100).toFixed(0);
  };

  return (
    <div className="space-y-8 fade-in pb-12">
      {/* Header */}
      <div className="text-center space-y-4">
        <Badge variant="outline" className="text-sm px-3 py-1">
          Planes y Precios
        </Badge>
        <h1 className="text-4xl font-bold text-foreground">
          Elige el plan perfecto para tu negocio
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Desde freelancers hasta empresas en crecimiento. Encuentra el plan que se ajuste a tus necesidades.
        </p>
      </div>

      {/* Billing Toggle */}
      <div className="flex items-center justify-center gap-4">
        <Label htmlFor="billing-toggle" className={billingCycle === "monthly" ? "font-semibold" : ""}>
          Mensual
        </Label>
        <Switch
          id="billing-toggle"
          checked={billingCycle === "yearly"}
          onCheckedChange={(checked) => setBillingCycle(checked ? "yearly" : "monthly")}
        />
        <Label htmlFor="billing-toggle" className={billingCycle === "yearly" ? "font-semibold" : ""}>
          Anual
          <Badge variant="secondary" className="ml-2">Ahorra 17%</Badge>
        </Label>
      </div>

      {/* Plans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
        {plans.map((plan) => {
          const PlanIcon = plan.icon;
          const price = billingCycle === "monthly" ? plan.priceMonthly : plan.priceYearly;
          const savings = calculateSavings(plan.priceMonthly, plan.priceYearly);

          return (
            <Card
              key={plan.id}
              className={`relative flex flex-col ${
                plan.popular ? "border-primary border-2 shadow-lg scale-105" : ""
              } ${selectedPlan === plan.id ? "ring-2 ring-primary" : ""}`}
            >
              {plan.badge && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <Badge className={`bg-gradient-to-r ${plan.color} text-white`}>
                    {plan.badge}
                  </Badge>
                </div>
              )}

              <CardHeader className="text-center space-y-3 pt-6">
                <div className={`w-16 h-16 mx-auto rounded-full bg-gradient-to-br ${plan.color} flex items-center justify-center`}>
                  <PlanIcon className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-2xl">{plan.name}</CardTitle>
                <CardDescription>{plan.description}</CardDescription>
              </CardHeader>

              <CardContent className="flex-1 space-y-6">
                {/* Price */}
                <div className="text-center">
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="text-4xl font-bold">${price}</span>
                    <span className="text-muted-foreground">
                      {billingCycle === "monthly" ? "/mes" : "/año"}
                    </span>
                  </div>
                  {billingCycle === "yearly" && plan.priceMonthly > 0 && (
                    <p className="text-sm text-green-600 mt-1">
                      Ahorras ${(plan.priceMonthly * 12 - plan.priceYearly).toFixed(2)} al año
                    </p>
                  )}
                </div>

                {/* Limits */}
                <div className="space-y-2 text-sm border-t pt-4">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-muted-foreground" />
                    <span>{plan.limits.users}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <HardDrive className="w-4 h-4 text-muted-foreground" />
                    <span>{plan.limits.storage}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Headphones className="w-4 h-4 text-muted-foreground" />
                    <span>{plan.limits.support}</span>
                  </div>
                </div>

                {/* Features */}
                <div className="space-y-2 border-t pt-4">
                  {plan.features.slice(0, 5).map((feature, index) => (
                    <div key={index} className="flex items-start gap-2 text-sm">
                      {feature.included ? (
                        <Check className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                      ) : (
                        <X className="w-5 h-5 text-muted-foreground shrink-0 mt-0.5" />
                      )}
                      <span className={feature.included ? "" : "text-muted-foreground"}>
                        {feature.name}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Modules */}
                <div className="space-y-2 border-t pt-4">
                  <p className="text-sm font-semibold">Módulos incluidos:</p>
                  <div className="flex flex-wrap gap-2">
                    {plan.modules.map((module) => (
                      <Badge key={module} variant="secondary" className="text-xs">
                        {module}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>

              <CardFooter className="pt-0">
                <Button
                  className="w-full"
                  variant={plan.popular ? "default" : "outline"}
                  onClick={() => handleSelectPlan(plan.id)}
                >
                  {plan.priceMonthly === 0 ? "Comenzar gratis" : "Seleccionar plan"}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </CardFooter>
            </Card>
          );
        })}
      </div>

      {/* Add-ons Section */}
      <div className="mt-16 space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-bold">Mejora tu experiencia</h2>
          <p className="text-muted-foreground">
            Servicios adicionales disponibles para todos los planes
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {addOns.map((addOn) => {
            const AddOnIcon = addOn.icon;
            return (
              <Card key={addOn.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-3">
                    <AddOnIcon className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle className="text-lg">{addOn.name}</CardTitle>
                  <CardDescription>{addOn.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-bold">${addOn.price}</span>
                    <span className="text-muted-foreground">/mes</span>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full">
                    Agregar
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Comparison Table */}
      <div className="mt-16">
        <Tabs defaultValue="features" className="w-full">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2">
            <TabsTrigger value="features">Características</TabsTrigger>
            <TabsTrigger value="modules">Módulos</TabsTrigger>
          </TabsList>

          <TabsContent value="features" className="mt-8">
            <Card>
              <CardHeader>
                <CardTitle>Comparación detallada de planes</CardTitle>
                <CardDescription>
                  Encuentra las diferencias entre cada plan
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-4 font-semibold">Característica</th>
                        {plans.map((plan) => (
                          <th key={plan.id} className="text-center p-4 font-semibold">
                            {plan.name}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b">
                        <td className="p-4">Usuarios</td>
                        {plans.map((plan) => (
                          <td key={plan.id} className="text-center p-4">
                            {plan.limits.users}
                          </td>
                        ))}
                      </tr>
                      <tr className="border-b">
                        <td className="p-4">Clientes</td>
                        {plans.map((plan) => (
                          <td key={plan.id} className="text-center p-4">
                            {plan.limits.clients}
                          </td>
                        ))}
                      </tr>
                      <tr className="border-b">
                        <td className="p-4">Almacenamiento</td>
                        {plans.map((plan) => (
                          <td key={plan.id} className="text-center p-4">
                            {plan.limits.storage}
                          </td>
                        ))}
                      </tr>
                      <tr className="border-b">
                        <td className="p-4">Integraciones</td>
                        {plans.map((plan) => (
                          <td key={plan.id} className="text-center p-4">
                            <Check className="w-5 h-5 text-green-500 mx-auto" />
                          </td>
                        ))}
                      </tr>
                      {plans[0].features.map((_, index) => {
                        const featureName = plans[0].features[index].name;
                        return (
                          <tr key={index} className="border-b">
                            <td className="p-4">{featureName}</td>
                            {plans.map((plan) => (
                              <td key={plan.id} className="text-center p-4">
                                {plan.features[index]?.included ? (
                                  <Check className="w-5 h-5 text-green-500 mx-auto" />
                                ) : (
                                  <X className="w-5 h-5 text-muted-foreground mx-auto" />
                                )}
                              </td>
                            ))}
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="modules" className="mt-8">
            <Card>
              <CardHeader>
                <CardTitle>Módulos disponibles por plan</CardTitle>
                <CardDescription>
                  Descubre qué funcionalidades incluye cada plan
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {plans.map((plan) => (
                    <div key={plan.id} className="space-y-3">
                      <h3 className="font-semibold text-lg">{plan.name}</h3>
                      <div className="space-y-2">
                        {plan.modules.map((module) => (
                          <div key={module} className="flex items-center gap-2">
                            <Check className="w-4 h-4 text-green-500" />
                            <span className="text-sm">{module}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* FAQ Section */}
      <div className="mt-16 max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-2">Preguntas frecuentes</h2>
          <p className="text-muted-foreground">
            ¿Tienes dudas? Aquí están las respuestas
          </p>
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">¿Puedo cambiar de plan en cualquier momento?</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Sí, puedes actualizar o reducir tu plan en cualquier momento. Los cambios se aplican inmediatamente y ajustamos el precio proporcionalmente.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">¿Qué métodos de pago aceptan?</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Aceptamos tarjetas de crédito/débito (Visa, Mastercard, American Express) y transferencias bancarias para planes anuales.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">¿Hay período de prueba?</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Sí, ofrecemos 14 días de prueba gratis en cualquier plan de pago. No se requiere tarjeta de crédito para el plan gratuito.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">¿Qué incluye el soporte?</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Todos los planes incluyen acceso a nuestra base de conocimientos. Los planes de pago incluyen soporte por email, y los planes Estándar y Premium incluyen chat y teléfono según corresponda.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* CTA Section */}
      <div className="mt-16">
        <Card className="bg-gradient-to-r from-primary/10 via-purple-500/10 to-primary/10 border-primary/20">
          <CardContent className="text-center py-12 space-y-4">
            <Shield className="w-16 h-16 mx-auto text-primary" />
            <h2 className="text-3xl font-bold">¿Necesitas ayuda para elegir?</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Nuestro equipo está disponible para ayudarte a encontrar el plan perfecto para tu negocio. Contáctanos para una consulta personalizada.
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <Button size="lg">
                Contactar con ventas
              </Button>
              <Button size="lg" variant="outline">
                Agendar demostración
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
