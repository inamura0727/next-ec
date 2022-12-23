import prisma from '../../../../lib/prisma';

export default async function PreTop(take: number, favoriteId: number) {
    const item = await prisma.item.findMany({
        orderBy: {
            itemId: 'desc',
        },
        take: take,
    });

    const newItems = item.map((item) => ({
        ...item,
        releaseDate: item.releaseDate.toString(),
    }));

    const response = await prisma.item.findMany({
        where: {
            categories: {
                has: favoriteId,
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

    return {
        newItems: newItems,
        genreItems: genreItems
    }
}
