export interface Product {
  id?: number;
  sku: string;
  name: string;
  category: string;
  description?: string;
  purchasePrice: number;
  price: number;
  stockQuantity: number;
  reorderLevel: number;
  unitOfMeasure: string;
  isActive: boolean;
}
