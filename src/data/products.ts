import type { ProductModel } from '@/types/order.types';

const products: ProductModel[] = [
  {
    id: '1',
    name: 'Bàn chải đánh răng Colgate',
    code: '100000293424',
    price: 12000,
    unit: 'Cái',
  },
  {
    id: '5',
    name: 'Kem đánh răng Closeup',
    code: '100000528712',
    price: 26000,
    unit: 'Tuýp',
  },
  {
    id: '2',
    name: 'Khăn tắm',
    price: 75000,
    unit: 'Cái',
  },
  {
    id: '3',
    name: 'Muỗng bạc cao cấp',
    code: '200000329485',
    price: 53000,
    unit: 'Cái',
  },
  {
    id: '4',
    name: 'Dao chém gió',
    code: '200000410842',
    price: 34000,
    unit: 'Cái',
  },
];

export default products;
