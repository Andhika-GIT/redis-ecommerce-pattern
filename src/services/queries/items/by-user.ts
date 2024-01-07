import { client } from '$services/redis';
import { itemIndexKey } from '$services/keys';
import { deserialize } from './deserialize';

interface QueryOpts {
	page: number;
	perPage: number;
	sortBy: string;
	direction: string;
}

export const itemsByUser = async (userId: string, opts: QueryOpts) => {
	const query = `@ownerId:${userId}`;

	return {
		totalPage: 0,
		items: []
	};
};
