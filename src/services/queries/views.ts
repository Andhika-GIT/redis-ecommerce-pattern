import { client } from "$services/redis";

import { itemKey, itemByViewsKey } from "$services/keys";

export const incrementView = async (itemId: string, userId: string) => {

    await Promise.all([
        // increment the item for 'views' property for hash data
        client.HINCRBY(
            itemKey(itemId),
            'views',
            1
        ),

        // increment the item 'views' score for sorted set
        client.ZINCRBY(
            itemByViewsKey(),
            1,
            itemId
        )
    ])
  


    
};
