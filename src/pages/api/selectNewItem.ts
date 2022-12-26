import prisma from '../../../lib/prisma';

export default async function selectNewItem(take: number){

    const response = await prisma.item.findMany({
        orderBy: {
            itemId: 'desc',
        },
        take: take,
        });

        const newItems = response.map((item) => ({
        ...item,
        releaseDate: item.releaseDate.toString(),
        }));

        return newItems;
}
