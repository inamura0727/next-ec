import { NextApiRequest, NextApiResponse } from "next";
import { Item } from "types/item";
import prisma from '../../../lib/prisma';

export default async function selectNewItem(req: NextApiRequest, res: NextApiResponse<Array<Item>>){
    const response = await prisma.item.findMany({
        orderBy: {
            itemId: 'desc',
        },
        take: 10,
        });

        const newItems = response.map((item) => ({
        ...item,
        releaseDate: item.releaseDate.toString(),
        }));

        res.json(newItems);
}
