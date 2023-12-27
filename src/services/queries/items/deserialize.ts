import type { Item } from '$services/types';
import { DateTime } from 'luxon';

export const deserialize = (id: string, item: { [key: string]: string }): Item => {
	return {
		id: id,
		name: item.name,
		ownerId: item.ownerId,
		imageUrl: item.imageUrl,
		description: item.description,
		views: Number(item.views),
		likes: Number(item.likes),
		price: parseFloat(item.price),
		bids: Number(item.bids),
		highestBidUserId: item.highestBidUserId,
		createdAt: DateTime.fromMillis(Number(item.createdAt)),
		endingAt: DateTime.fromMillis(Number(item.endingAt))
	};
};
