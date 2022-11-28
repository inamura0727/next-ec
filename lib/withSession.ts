import * as IronSession from "iron-session";

// iron-sessionで『user』と『cart』が使えるようにするための定義
declare module "iron-session" {
    interface IronSessionData {
      user?: {
        id: number;
        userName: string;
        userCarts?:any[];
      };
      
      cart?:{
        id: number;
        itemName: string;
        rentalPeriod: number;
        price: number;
        itemImage: string;
      }[];

      isLoggedIn?:{
        login: boolean
      }
    }
  }
