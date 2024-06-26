import type { CreateBidAttrs, Bid } from '$services/types';
import { itemBidHistoryKey, itemByPriceKey, itemKey } from '$services/keys';
import { client, withLock } from '$services/redis';
import { DateTime } from 'luxon';
import { getItem } from './items';

const serializeHistory = (amount: number, createdAt: number) => {
	return `${amount}:${createdAt}`;
};

const deserializeHistory = (stored: string) => {
	const [amount, createdAt] = stored.split(':');

	return {
		amount: parseFloat(amount),
		createdAt: DateTime.fromMillis(parseInt(createdAt))
	};
};

export const createBid = async (attrs: CreateBidAttrs) => {
	// implement withLock to avoid race condition
	return withLock(attrs.itemId, async () => {
		// validation 1 : check if item exist
		const item = await getItem(attrs.itemId);

		if (!item) {
			throw new Error("item doesn't exist");
		}
		// validation 2 : check if item expired
		if (item.endingAt.diff(DateTime.now()).toMillis() < 0) {
			throw new Error('item closed to binding');
		}

		// validation 3 : check if user input bid amount is greater than current amount
		if (item.price >= attrs.amount) {
			throw new Error('bid is too low');
		}

		// create new list
		const convertedDate = attrs.createdAt.toMillis();

		return Promise.all([
			// create new list for spesific item
			client.RPUSH(itemBidHistoryKey(attrs.itemId), serializeHistory(attrs.amount, convertedDate)),
			// update the item in the hash based on the spesific key id
			client.HSET(itemKey(item.id), {
				bids: item.bids + 1,
				price: attrs.amount,
				highestBidUserId: attrs.userId
			}),
			client.ZADD(itemByPriceKey(), {
				value: item.id,
				score: attrs.amount
			})
		]);
	});

	// // create isolated connection for this particular action
	// return client.executeIsolated(async (isolatedClient) => {
	// 	// watch for this spesific key item
	// 	await isolatedClient.WATCH(itemKey(attrs.itemId));
	// 	//  if it change, cancel all action and the transaction below (to avoid double same value)
	// });
};

export const getBidHistory = async (itemId: string, offset = 0, count = 10): Promise<Bid[]> => {
	const startIndex = -1 * offset - count;
	const endIndex = -1 - offset;

	const range = await client.LRANGE(itemBidHistoryKey(itemId), startIndex, endIndex);

	return range.map((bid) => deserializeHistory(bid));
};
