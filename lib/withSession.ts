import * as IronSession from 'iron-session';

// iron-sessionで『user』と『cart』が使えるようにするための定義
declare module 'iron-session' {
  interface IronSessionData {
    user?: {
      id: number;
      userName: string;
    };

    cart?: {
      cartId: number;
      itemId: number;
      userId: number;
      rentalPeriod: number;
    }[];
  }
}
