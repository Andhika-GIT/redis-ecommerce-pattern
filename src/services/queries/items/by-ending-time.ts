import { itemByEndingAtKey } from "$services/keys";
import { client } from "$services/redis";


export const itemsByEndingTime = async (
	order: 'DESC' | 'ASC' = 'DESC',
	offset = 0,
	count = 10
) => {
	const ids = await client.ZRANGE(itemByEndingAtKey(), 130, '+inf', {
		BY: 'SCORE',
		LIMIT: {
			offset: offset,
			count: count
		}
	}
	)

	console.log(ids)
};
