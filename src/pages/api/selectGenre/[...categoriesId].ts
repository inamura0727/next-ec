import { NextApiRequest, NextApiResponse } from "next";
import { Item } from "types/item";
import prisma from '../../../../lib/prisma';

export default async function selectGenre (req: NextApiRequest, res: NextApiResponse<Array<Item>>) {
    let id = 0;
    let take = 0;
    const { categoriesId } = req.query;
    if(Array.isArray(categoriesId)){
      id = Number(categoriesId[0]);
      take = Number(categoriesId[1])
    }
    const response = await prisma.item.findMany({
        where: {
          categories: {
            has: id,
          },
        },
        orderBy: {
          itemId: 'desc',
        },
        take: take,
      });
    
      const genreItems = response.map((item) => ({
        ...item,
        releaseDate: item.releaseDate.toString(),
      }));

      res.json(genreItems)
}
