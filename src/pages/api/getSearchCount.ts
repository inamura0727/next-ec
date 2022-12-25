import prisma from "../../../lib/prisma";

export default async function getSearchCount(id: number, keyword: string | string[] | undefined) {
  let items;
  if (typeof keyword === 'string')

    if (keyword.length === 0) {
      items = await prisma.item.findMany({
        where: {
          categories: {
            has: id,
          }
        }
      });
    } else if (id === 0) {
      items = await prisma.item.findMany({
        where: {
          keywords: {
            has: keyword
          }
        }
      });
    } else {
      items = await prisma.item.findMany({
        where: {
          categories: {
            has: id,
          },
          keywords: {
            has: keyword
          }
        }
      });
    }
  if (items)
    return { count: items.length };
}
