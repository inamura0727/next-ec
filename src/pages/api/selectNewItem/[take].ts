import { NextApiRequest, NextApiResponse } from "next";
import { Item } from "types/item";
import prisma from '../../../../lib/prisma';

export default async function selectNewItem(req:NextApiRequest, res: NextApiResponse<Array<Item>>){
    let takeNum = 0;
    const { take } = req.query;
    if(typeof take === 'string'){
        takeNum = Number(take);
    }

    const response = await prisma.item.findMany({
        orderBy: {
            itemId: 'desc',
        },
        take: takeNum,
        });

        const newItems = response.map((item) => ({
        ...item,
        releaseDate: item.releaseDate.toString(),
        }));

        res.json(newItems);
}
