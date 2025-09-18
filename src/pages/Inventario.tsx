import { useState } from "react";
import { Package, Plus, Search, Filter, Download, AlertTriangle, TrendingUp, Boxes, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ProductModal } from "@/components/inventory/ProductModal";
import { useToast } from "@/hooks/use-toast";

export default function Inventario() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const { toast } = useToast();

  // Mock data para productos
  const [products, setProducts] = useState([
    {
      id: 1,
      name: "Taladro Profesional HD-2000",
      sku: "TAL-001",
      category: "herramientas",
      stock: 15,
      minStock: 5,
      price: 299.99,
      description: "Taladro profesional de alta resistencia con motor de 2000W",
      lastUpdate: "2024-01-15"
    },
    {
      id: 2,
      name: "Cemento Portland 50kg",
      sku: "CEM-001",
      category: "materiales",
      stock: 2,
      minStock: 10,
      price: 12.50,
      description: "Cemento Portland tipo I de 50kg para construcción",
      lastUpdate: "2024-01-14"
    },
    {
      id: 3,
      name: "Soldadora MIG/MAG 200A",
      sku: "SOL-001",
      category: "equipos",
      stock: 8,
      minStock: 3,
      price: 850.00,
      description: "Soldadora profesional MIG/MAG de 200 amperios",
      lastUpdate: "2024-01-13"
    },
    {
      id: 4,
      name: "Guantes de Seguridad",
      sku: "GUA-001",
      category: "consumibles",
      stock: 25,
      minStock: 15,
      price: 8.99,
      description: "Guantes de seguridad industrial resistentes",
      lastUpdate: "2024-01-16"
    },
    {
      id: 5,
      name: "Martillo Demoledor 15kg",
      sku: "MAR-001",
      category: "herramientas",
      stock: 6,
      minStock: 4,
      price: 450.00,
      description: "Martillo demoledor eléctrico de 15kg de potencia",
      lastUpdate: "2024-01-12"
    }
  ]);

  const handleNewProduct = () => {
    setEditingProduct(null);
    setIsModalOpen(true);
  };

  const handleEditProduct = (product: any) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  const handleDeleteProduct = (id: number) => {
    setProducts(prev => prev.filter(product => product.id !== id));
    toast({
      title: "Producto eliminado",
      description: "El producto ha sido eliminado del inventario.",
    });
  };

  const handleSaveProduct = (productData: any) => {
    if (editingProduct) {
      setProducts(prev => prev.map(product => 
        product.id === editingProduct.id ? productData : product
      ));
      toast({
        title: "Producto actualizado",
        description: "Los datos del producto han sido actualizados.",
      });
    } else {
      setProducts(prev => [...prev, productData]);
      toast({
        title: "Producto creado",
        description: "El nuevo producto ha sido agregado al inventario.",
      });
    }
  };

  const getStockStatus = (stock: number, minStock: number) => {
    if (stock <= minStock) return { status: "crítico", color: "bg-red-500/20 text-red-400 border-red-500/30" };
    if (stock <= minStock * 1.5) return { status: "bajo", color: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30" };
    return { status: "normal", color: "bg-green-500/20 text-green-400 border-green-500/30" };
  };

  const getCategoryName = (category: string) => {
    const categories: Record<string, string> = {
      herramientas: "Herramientas",
      materiales: "Materiales",
      equipos: "Equipos",
      consumibles: "Consumibles"
    };
    return categories[category] || category;
  };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const lowStockProducts = products.filter(p => p.stock <= p.minStock).length;
  const totalValue = products.reduce((sum, p) => sum + (p.stock * p.price), 0);

  return (
    <div className="space-y-6 fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Package className="w-7 h-7 text-primary" />
            Control de Inventario
          </h1>
          <p className="text-muted-foreground mt-1">
            Gestiona el stock y materiales de tu empresa
          </p>
        </div>
        
        <div className="flex gap-3">
          <Button variant="outline" onClick={() => toast({ title: "Función no disponible", description: "En desarrollo." })}>
            <Download className="w-4 h-4 mr-2" />
            Exportar
          </Button>
          <Button onClick={handleNewProduct}>
            <Plus className="w-4 h-4 mr-2" />
            Nuevo Producto
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Buscar productos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button variant="outline" onClick={() => toast({ title: "Función no disponible", description: "En desarrollo." })}>
          <Filter className="w-4 h-4 mr-2" />
          Filtros
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Boxes className="w-4 h-4" />
              Total Productos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{products.length}</div>
            <p className="text-xs text-success">+3 este mes</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" />
              Stock Bajo
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{lowStockProducts}</div>
            <p className="text-xs text-muted-foreground">Requieren atención</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Valor Total
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">${totalValue.toLocaleString()}</div>
            <p className="text-xs text-info">Inventario actual</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Movimientos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">127</div>
            <p className="text-xs text-warning">Este mes</p>
          </CardContent>
        </Card>
      </div>

      {/* Products Table */}
      <Card>
        <CardHeader>
          <CardTitle>Productos en Inventario</CardTitle>
          <CardDescription>
            Lista de productos con estado de stock actual
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredProducts.map((product) => {
              const stockStatus = getStockStatus(product.stock, product.minStock);
              const stockPercentage = Math.min((product.stock / (product.minStock * 2)) * 100, 100);
              
              return (
                <div key={product.id} className="group flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/30 transition-colors">
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-foreground">{product.name}</h3>
                      <div className="flex items-center gap-2">
                        <Badge className={stockStatus.color} variant="secondary">
                          {stockStatus.status}
                        </Badge>
                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleEditProduct(product)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleDeleteProduct(product.id)}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>SKU: {product.sku}</span>
                      <span>Categoría: {getCategoryName(product.category)}</span>
                      <span>Precio: ${product.price}</span>
                    </div>
                    
                    <div className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span>Stock: {product.stock} unidades</span>
                        <span>Mín: {product.minStock}</span>
                      </div>
                      <Progress value={stockPercentage} className="h-2" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Modal */}
      <ProductModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        product={editingProduct}
        onSave={handleSaveProduct}
      />
    </div>
  );
}
