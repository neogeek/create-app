import { prisma } from '../../utils/db';

export const getProfile = async (userId: number) =>
  await prisma.user.findFirstOrThrow({
    where: {
      userId,
    },
  });

export const updateProfile = async (
  userId: number,
  username: string,
  displayName: string
) =>
  await prisma.user.update({
    where: {
      userId,
    },
    data: {
      username,
      displayName,
    },
  });
