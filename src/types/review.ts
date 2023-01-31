import { User } from "./user";

type Reviews = {
  itemId: number;
  itemName: string;
  userId: number;
  userName: string;
  postTime: string;
  reviewName: string;
  reviewText: string;
  evaluation: number;
  spoiler: boolean;
  reviewId: number;
  fesName:string;
  itemImg:string;
  id:number;
  user: User
};
export type { Reviews };
