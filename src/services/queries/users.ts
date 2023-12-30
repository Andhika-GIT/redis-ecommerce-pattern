import type { CreateUserAttrs } from '$services/types';
import { genId } from '$services/utils';
import { client } from '$services/redis';
import { usersKey, usernameUniquekey, usernamesKey } from '$services/keys';
import type { Attribute } from 'svelte/types/compiler/interfaces';


const serialize = (user : CreateUserAttrs) => {
    return {
        username : user.username,
        password : user.password
    }
}

const deserialize = (id : string, user : { [key:string] : string }) => {
    return {
        id : id,
        username : user.username,
        password : user.password
    }
}

export const getUserByUsername = async (username: string) => {};

export const getUserById = async (id: string) => {
    const user = await client.HGETALL(usersKey(id))

    return deserialize(id, user)
};

export const createUser = async (attrs: CreateUserAttrs) => {
    const id = genId()

    // check if username exist by using Set 
    const exist = await client.SISMEMBER(
        usernameUniquekey(),
        attrs.username
    )

    // if username is exist (taken), throw error, tell user to use another username
    if (exist) {
        throw new Error('username is taken')
    }


    // otherwise, add the username into our sets 
    await client.SADD(usernameUniquekey(), attrs.username)


    // store the user username and id into sorted set (for login purpose)
    await client.ZADD(
        usernamesKey(), {
        value: attrs.username,
        // because sorted set only takes number, convert the id (hexa) to int (decimal)
        score: parseInt(id, 16)
       }
    )

    // store the username and password into hash
    await client.HSET(
        usersKey(id),
        serialize(attrs)
    )

    return id
};


 