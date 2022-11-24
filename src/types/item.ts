// 作品情報
type Item = {
  id: number;
  fesName: string;
  artist: string;
  itemDetail: string;
  itemImage: string;
  // 形式: yyyy-MM-dd
  releaseDate: Date;
  // 単位：分
  palyTime: number;
  twoDaysPrice: number;
  sevenDaysPrice: number;
  categories: [id: number];
};


export type { Item }
