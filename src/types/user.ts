import { Item } from './item';

// ユーザ情報
type User = {
  id: number;
  userName: string;
  familyName: string;
  firstName: string;
  familyNameKana: string;
  firstNameKana: string;
  zipcode: string;
  prefecture: string;
  city: string;
  houseNumber: string;
  building: string;
  phoneNumber: string;
  mailAddress: string;
  password: string;
  rentalHistories: RentalHistory[];
  userCarts: UserCart[];
  favoriteGenre: number;
};

// レンタル履歴
type RentalHistory = {
  displayPeriod?: string;
  id: number;
  itemId: number;
  itemName: string;
  price: number;
  itemImage: string;
  // 単位：日
  rentalPeriod: number;
  // 形式: yyyy-MM-dd hh:mm:ss
  payDate: Date;
  // 形式: yyyy-MM-dd hh:mm:ss
  rentalStart?: Date;
  // 形式: yyyy-MM-dd hh:mm:ss
  rentalEnd?: Date;
};

// カート情報
type UserCart = {
  cartId: number;
  itemId: number;
  userId?: number;
  // 単位：日
  rentalPeriod: number;
  items: Item;
};

type SessionUserCart = {
  cartId: number;
  itemId: number;
  rentalPeriod: number;
  items: Item;
};

export type { User, RentalHistory, UserCart, SessionUserCart };
