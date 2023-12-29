import { client } from "$services/redis";

import { itemKey, userLikesKey } from "$services/keys";

export const userLikesItem = async (itemId: string, userId: string) => {
    const alreadyLikePost = await client.SISMEMBER(
        userLikesKey(userId),
        itemId
    )

    if (alreadyLikePost) return true

    return false
}

export const likedItems = async (userId: string) => {
   
};

export const likeItem = async (itemId: string, userId: string) => {
   const inserted =  await client.SADD(
        userLikesKey(userId),
        itemId
    )

    if (inserted) {
        return client.HINCRBY(itemKey(itemId), 'likes', 1)
    }
};

export const unlikeItem = async (itemId: string, userId: string) => {
   const removed =  await client.SREM(
        userLikesKey(userId),
        itemId
    )

    if (removed) {
        return client.HINCRBY(itemKey(itemId), 'likes', -1)
    }
};

export const commonLikedItems = async (userOneId: string, userTwoId: string) => {};
