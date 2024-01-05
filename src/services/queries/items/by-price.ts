import { client } from '$services/redis';
import { itemKey, itemByViewsKey, itemByPriceKey } from '$services/keys';
import { deserialize } from './deserialize';

export const itemsByPrice = async (order: 'DESC' | 'ASC' = 'DESC', offset = 0, count = 10) => {
	let results: any = await client.SORT(itemByPriceKey(), {
		GET: [
			'#',
			`${itemKey('*')}->name`,
			`${itemKey('*')}->views`,
			`${itemKey('*')}->endingAt`,
			`${itemKey('*')}->imageUrl`,
			`${itemKey('*')}->price`
		],
		// nosort -> get the result of the default sorting that done by items:views sorted set, which sort the items:views by score
		BY: 'nosort',
		// specify the DIRECTION, either 'ASC' or 'DSC' (we got this value as argument in this function)
		DIRECTION: order,
		// spesify start index and count (total item) that shows in the client
		LIMIT: {
			offset: offset,
			count: count
		}
	});

	const items = [];

	while (results.length) {
		// parse the results
		// take the id, name, views, endingAt, imageUrl, price frm results array data
		const [id, name, views, endingAt, imageUrl, price, ...rest] = results;
		const item = deserialize(id, { name, views, endingAt, imageUrl, price });

		// push it into new items array variabel
		items.push(item);
		results = rest;
	}

	return items;
};
