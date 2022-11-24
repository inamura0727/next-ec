// ユーザ情報
type User = {
  id: number;
  userName: string;
  familyName: string;
  fisrtName: string;
  mailAddress: string;
  password: string;
  rentalHistory: RentalHistory[];
  userCarts: UserCart[];
};

// レンタル履歴
type RentalHistory = {
  id: number;
  price: number;
  itemImage: string;
  // 単位：日
  rentalPriod: number;
  // 形式: yyyy-MM-dd hh:mm:ss
  payDate: Date;
  // 形式: yyyy-MM-dd hh:mm:ss
  rentalStart: Date;
  // 形式: yyyy-MM-dd hh:mm:ss
  rentalEnd: Date;
};

// カート情報
type UserCart = {
  id: number;
  itemName: string;
  // 単位：日
  rentalpriod: number;
  price: number;
};

export type { User, RentalHistory, UserCart };
