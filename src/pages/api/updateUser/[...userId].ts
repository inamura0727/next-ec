import { NextApiRequest } from 'next';
import prisma from '../../../../lib/prisma';

export default async function updateUser(req: NextApiRequest) {
    let id = 0;
    let genre = 0;
    const { userId } = req.query;
    if (Array.isArray(userId)) {
        id = Number(userId[0]);
        genre = Number(userId[1])
    };

    await prisma.user.update({
        where: {
            userId: id
        },
        data: {
            favoriteId: genre
        }
    });
}
