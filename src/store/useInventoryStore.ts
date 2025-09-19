import { create } from 'zustand';
import { toast } from '@/hooks/use-toast';

const initialProducts = [
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
  ];

interface InventoryState {
  products: any[];
  saveProduct: (productData: any, existingProductId?: number) => void;
  deleteProduct: (id: number) => void;
}

export const useInventoryStore = create<InventoryState>((set) => ({
  products: initialProducts,
  saveProduct: (productData, existingProductId) => {
    set((state) => {
      const parsedData = {
        ...productData,
        price: parseFloat(productData.price) || 0,
        stock: parseInt(productData.stock, 10) || 0,
        minStock: parseInt(productData.minStock, 10) || 0,
      };

      if (existingProductId) {
        toast({
          title: "Producto actualizado",
          description: "Los datos del producto han sido actualizados.",
        });
        return {
          products: state.products.map(p =>
            p.id === existingProductId ? { ...p, ...parsedData } : p
          ),
        };
      } else {
        toast({
          title: "Producto creado",
          description: "El nuevo producto ha sido agregado al inventario.",
        });
        return {
          products: [...state.products, { ...parsedData, id: Date.now(), lastUpdate: new Date().toISOString().split('T')[0] }],
        };
      }
    });
  },
  deleteProduct: (id) => {
    set((state) => ({
      products: state.products.filter(p => p.id !== id),
    }));
    toast({
      title: "Producto eliminado",
      description: "El producto ha sido eliminado del inventario.",
    });
  },
}));
