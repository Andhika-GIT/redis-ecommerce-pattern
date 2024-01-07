import { client } from "$services/redis";
import { deserialize } from "./deserialize";
import { itemIndexKey } from "$services/keys";

export const searchItems = async (term: string, size: number = 5) => {
    const cleaned = term
    .replaceAll(/[^a-zA-Z ]/g, '')
    .trim()
    .split(' ')
    .map(word => word ? `%${word}%` : '')
    .join(" ")


    // check if cleaned is empty
    if (cleaned === "") {
        return []
    }

    // run the search query
    const results = await client.ft.SEARCH(
        itemIndexKey(),
        cleaned, 
        {
            // specify the limit 
            LIMIT: {
                from: 0,
                size : 5,
            }
        }
    )

    // map over the results, and deserialize documents array of object property 
    return results.documents.map((result) => deserialize(result.id, result.value as any))
};
