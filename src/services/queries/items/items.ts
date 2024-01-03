import type { CreateItemAttrs } from '$services/types';
import { client } from '$services/redis';
import { genId } from '$services/utils';
import { itemKey, itemByViewsKey, itemByEndingAtKey, itemByPriceKey } from '$services/keys';
import { serialize } from './serialize';
import { deserialize } from './deserialize';

export const getItem = async (id: string) => {
	const item = await client.HGETALL(itemKey(id));

	// check if item is empty
	if (Object.keys(item).length === 0) {
		return null;
	}

	return deserialize(id, item);
};

export const getItems = async (ids: string[]) => {
	const commands = ids.map((id) => {
		return client.HGETALL(itemKey(id));
	});

	const results = await Promise.all(commands);

	const data = results.map((result, index) => {
		if (Object.keys(result).length === 0) {
			return null;
		}

		return deserialize(ids[index], result);
	});

	return data;
};

export const createItem = async (attrs: CreateItemAttrs, userId: string) => {
	const id = genId();

	// PIPELINE to run all query in single request
	await Promise.all([

		// sorted set keys and value for most views ( to display most view item in dashboard )
		client.ZADD(
			itemByViewsKey(),
			{
				// insert the item id as member, and views total as score 
				// the default views will 0, because it's a new item
				value: id,
				score: 0,
				
			}
		),

		// sorted set keys and value for ending at ( to display selling item that ending soon in dashboard)
		client.ZADD(
			itemByEndingAtKey(),
			{
				// insert the item id as member, and score as ending time 
				// the ending time will unix timestamp in milisecond
				value:id,
				score: attrs.endingAt.toMillis()
			}
		),

		// sorted set keys and value for price ( to sort item by price in dashboard)
		client.ZADD(
			itemByPriceKey(),
			{
				value:id,
				score: 0
			}
		),


		// create new item with id and it's property using hash
		client.HSET(itemKey(id), serialize(attrs))
	])

	return id;
};
