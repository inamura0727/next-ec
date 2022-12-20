import { NextApiRequest, NextApiResponse } from "next";
import { Item } from "types/item";
import prisma from '../../../lib/prisma';

export default async function selectGenre (req: NextApiRequest, res: NextApiResponse<Array<Item>>) {
    const {categoriesId} = req.body;
    const response = await prisma.item.findMany({
        where: {
          categories: {
            has: categoriesId,
          },
        },
        orderBy: {
          itemId: 'desc',
        },
        take: 10,
      });
    
      const genreItems = response.map((item) => ({
        ...item,
        releaseDate: item.releaseDate.toString(),
      }));

      res.json(genreItems)
}
