import { SchemaFieldTypes } from "redis";
import { itemIndexKey, itemKey } from "$services/keys";
import { client } from "./client";

export const createIndexes = async () => {
    // take all indexes
    const indexes = await client.ft._LIST()

    // check if item index key already exist inside index list
    const exist = indexes.find((index) => index === itemIndexKey())


    if (exist) {
        return
    }

    return client.ft.create(
        // create index
        itemIndexKey(),

        // define the field of the item hash and also the type
        {
            name: {
                type: SchemaFieldTypes.TEXT
            },
            description: {
                type: SchemaFieldTypes.TEXT
            }
        },
        {
            ON: 'HASH',
            PREFIX: itemKey('')
        }
    )
};
