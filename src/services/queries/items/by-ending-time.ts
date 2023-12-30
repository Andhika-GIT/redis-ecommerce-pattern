import { itemByEndingAtKey, itemKey } from "$services/keys";
import { client } from "$services/redis";
import { deserialize } from "./deserialize";


export const itemsByEndingTime = async (
	order: 'DESC' | 'ASC' = 'DESC',
	offset = 0,
	count = 10
) => {

	// sorted the item based item that ending soon
	// this will return item id based on item that ending soon
	const ids = await client.ZRANGE(itemByEndingAtKey(), Date.now(), '+inf', {
		BY: 'SCORE',
		LIMIT: {
			offset: offset,
			count: count
		}
	}
	)

	// pipeline to get all items based on the ids
	const results = await Promise.all(
		ids.map(id => client.HGETALL(itemKey(id)))
	)

	const items = results.map((item, i) => deserialize(ids[i],item))

	return items
	
};
