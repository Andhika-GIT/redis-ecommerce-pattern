import { SchemaFieldTypes } from "redis";
import { itemIndexKey, itemKey } from "$services/keys";
import { client } from "./client";

export const createIndexes = async () => {
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
