import type { CreateBidAttrs, Bid } from '$services/types';
import { itemBidHistoryKey } from '$services/keys';
import { client } from '$services/redis';
import { DateTime } from 'luxon';

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
	const convertedDate = attrs.createdAt.toMillis();

	await client.RPUSH(
		itemBidHistoryKey(attrs.itemId),
		serializeHistory(attrs.amount, convertedDate)
	);
};

export const getBidHistory = async (itemId: string, offset = 0, count = 10): Promise<Bid[]> => {
	const startIndex = -1 * offset - count;
	const endIndex = -1 - offset;

	const range = await client.LRANGE(itemBidHistoryKey(itemId), startIndex, endIndex);

	return range.map((bid) => deserializeHistory(bid));
};
