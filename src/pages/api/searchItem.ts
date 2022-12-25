import prisma from '../../../lib/prisma';

export default async function searchItem(keyword: string | string[] | undefined, id: number, orderBy: string | string[], order: string | string[], page
  : number, take: number) {
  let response;
  let skip = (page - 1) * take;
  let items;

  if (typeof keyword === 'string')
    if (typeof orderBy === 'string')
      if (typeof order === 'string')

        if (keyword.length === 0) {
          response = await prisma.item.findMany({
            where: {
              categories: {
                has: id,
              }
            },
            orderBy: {
              [orderBy]: order,
            },
            skip: skip,
            take: take,
          });
        } else if (id === 0) {
          response = await prisma.item.findMany({
            where: {
              OR: [
                {
                  keywords: {
                    has: keyword
                  }
                },
                {
                  artist: {
                    contains: keyword
                  }
                },
                {
                  fesName: {
                    contains: keyword
                  }
                }
              ]
            },
            orderBy: {
              [orderBy]: order,
            },
            skip: skip,
            take: take,
          });
        } else {
          response = await prisma.item.findMany({
            where: {
              OR: [
                {
                  keywords: {
                    has: keyword
                  }
                },
                {
                  artist: {
                    contains: keyword
                  }
                },
                {
                  fesName: {
                    contains: keyword
                  }
                }
              ],
              categories: {
                has: id,
              },
            },
            orderBy: {
              [orderBy]: order,
            },
            skip: skip,
            take: take,
          });
        }

  if (response)
    items = response.map((item) => ({
      itemId: item.itemId,
      itemImage: item.itemImage,
      artist: item.artist,
      fesName: item.fesName
    }));

  return items
}
