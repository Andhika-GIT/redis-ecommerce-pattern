import { client } from "$services/redis";

import { userLikesKey } from "$services/keys";

export const likedItems = async (userId: string) => {};

export const likeItem = async (itemId: string, userId: string) => {
    await client.SADD(
        userLikesKey(userId),
        itemId
    )
};

export const unlikeItem = async (itemId: string, userId: string) => {
    await client.SREM(
        userLikesKey(userId),
        itemId
    )
};

export const commonLikedItems = async (userOneId: string, userTwoId: string) => {};
