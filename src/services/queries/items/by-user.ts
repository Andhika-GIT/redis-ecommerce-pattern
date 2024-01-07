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
	// sort by ownerId field in item hashes
	const query = `@ownerId:{${userId}}`;

	// create sortCriteria if opts.sortBy and opts.direction available
	const sortCriteria =
		opts.sortBy && opts.direction
			? {
					BY: opts.sortBy,
					DIRECTION: opts.direction
			  }
			: undefined;

	const { total, documents } = await client.ft.search(itemIndexKey(), query, {
		ON: 'hash',
		SORTBY: sortCriteria,
		LIMIT: {
			from: opts.page * opts.perPage,
			size: opts.perPage
		}
	} as any);

	return {
		totalPage: Math.ceil(total / opts.perPage),
		items: documents.map((document) => {
			return deserialize(document.id.replace('item#', ''), document.value as any);
		})
	};
};
