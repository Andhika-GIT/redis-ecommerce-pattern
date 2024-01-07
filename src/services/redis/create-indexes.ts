import { SchemaFieldTypes } from 'redis';
import { itemIndexKey, itemKey } from '$services/keys';
import { client } from './client';

export const createIndexes = async () => {
	// take all indexes
	const indexes = await client.ft._LIST();

	// check if item index key already exist inside index list
	const exist = indexes.find((index) => index === itemIndexKey());

	if (exist) {
		return;
	}

	return client.ft.create(
		// create index
		itemIndexKey(),

		// define the field of the item hash and also the type
		{
			name: {
				type: SchemaFieldTypes.TEXT,
				SORTABLE: true
			},
			description: {
				type: SchemaFieldTypes.TEXT,
				SORTABLE: false
			},
			ownerId: {
				type: SchemaFieldTypes.TAG,
				SORTABLE: false
			},
			endingAt: {
				type: SchemaFieldTypes.NUMERIC,
				SORTABLE: true
			},
			bids: {
				type: SchemaFieldTypes.NUMERIC,
				SORTABLE: true
			},
			views: {
				type: SchemaFieldTypes.NUMERIC,
				SORTABLE: true
			},
			price: {
				type: SchemaFieldTypes.NUMERIC,
				SORTABLE: true
			},
			likes: {
				type: SchemaFieldTypes.NUMERIC,
				SORTABLE: true
			}
		} as any,
		{
			ON: 'HASH',
			PREFIX: itemKey('')
		}
	);
};
