type Product = {
  id: string;
  code?: string;
  name: string;
  unit: string;
  price: number;
};

export type OrderItem = {
  status: 'SUCCESS' | 'ERROR' | 'LOADING';
  product: Product;
  quantity: number;
};

export type Order = {
  id: string;
  name: string;
  items: OrderItem[];
};
