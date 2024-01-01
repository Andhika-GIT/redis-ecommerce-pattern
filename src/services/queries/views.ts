import { client } from "$services/redis";

import { itemKey, itemByViewsKey, itemUniqueViewsKey } from "$services/keys";

export const incrementView = async (itemId: string, userId: string) => {

    // using Hyperloglogs, check if the user already view the item, by checking their user id
   const notViewed =  await client.PFADD(itemUniqueViewsKey(userId), userId)


   // if hyperloglogs return 1, means the item is not yet viewed, so we can increment the view count
   if (notViewed) {
    await Promise.all([
        // increment the item for 'views' property for hash data ( to store static reguler data )
        client.HINCRBY(
            itemKey(itemId),
            'views',
            1
        ),

        // increment the item 'views' score for sorted set ( to sort the items by views in the dashboard )
        client.ZINCRBY(
            itemByViewsKey(),
            1,
            itemId
        )
    ])

}

    
  


    
};
