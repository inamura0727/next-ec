import { Item } from './item';

type SessionUserCart = {
  cartId: number;
  itemId: number;
  rentalPeriod: number;
  items: Item;
};

export type {SessionUserCart}
