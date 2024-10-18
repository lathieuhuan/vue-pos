import type { OrderModel } from '@/types/order.types';
import type { AccountModel } from '@/types/account.types';
import { formatDate } from '@/utils';
import { EOrderStatus, EPaymentMethod } from '@/constants/enums';

const db = {
  get<T>(key: string, defaultValue = '{}'): T {
    return JSON.parse(localStorage.getItem(key) || defaultValue);
  },
  set(key: string, data: any) {
    localStorage.setItem(key, JSON.stringify(data));
  },
};

function getNewOrderId(existOrders: OrderModel[] = []) {
  const nextIds = new Set<number>();

  for (const order of existOrders) {
    const id = +order.id;
    nextIds.delete(id);
    nextIds.add(id + 1);
  }
  return [...nextIds][0] ?? 0;
}

const ACCOUNT_SERVICE = {
  getAccount: () => {
    const account: AccountModel = {
      staff: {
        id: 'SS',
        name: 'Super Staff',
      },
    };
    return account;
  },
};

const ORDER_SERVICE = {
  getOrders: () => {
    return db.get<OrderModel[]>('orders', '[]');
  },
  createNewOrder: () => {
    const orders = ORDER_SERVICE.getOrders();
    const newOrder: OrderModel = {
      id: `${getNewOrderId(orders)}`,
      createdAt: formatDate(new Date()),
      customer: null,
      handler: ACCOUNT_SERVICE.getAccount().staff,
      status: EOrderStatus.PROCESSING,
      paymentInfo: {
        paymentMethod: EPaymentMethod.CASH,
      },
      items: [],
    };

    db.set('orders', orders.concat(newOrder));
    return newOrder;
  },
};

export { ACCOUNT_SERVICE, ORDER_SERVICE };
