import { client } from "$services/redis";
import { itemKey, itemByViewsKey } from "$services/keys";

export const itemsByViews = async (order: 'DESC' | 'ASC' = 'DESC', offset = 0, count = 10) => {
    /*

    1. GET # ->get all the member from items:views sorted set ( which already sorted by score ), and put it as the refrence for the backtick ( * ) in the next process.

    2.   `${itemKey('*')}->name` -> based on the previous process, the backtick ( * ) represents all the members from items:views sorted set, and since the members are the item id, so we point out the itemKey hash data based on the backtick (*) which represent the id, and get the field 'name'
    ex : itemKey('testid') then get get item:testid, then get the 'name' field value

    3.  `${itemKey('*')}->views` -> based on the previous process, the backtick ( * ) represents all the members from items:views sorted set, and since the members are the item id, so we point out the itemKey hash data based on the backtick (*) which represent the id, and get the field 'views'
      ex : itemKey('testid') then get get item:testid, then get the 'views' field value
     */
    const results = await client.SORT(itemByViewsKey(),{
        GET: [
            '#',
            `${itemKey('*')}->name`,
            `${itemKey('*')}->views`,
        ],
        // nosort -> get the result of the default sorting that done by items:views sorted set, which sort the items:views by score
        BY : 'nosort'
    })

   

    console.log(results)
};
