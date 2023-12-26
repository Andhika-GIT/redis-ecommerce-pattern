import type { CreateUserAttrs } from '$services/types';
import { genId } from '$services/utils';
import { client } from '$services/redis';
import { usersKey } from '$services/keys';
import type { Attribute } from 'svelte/types/compiler/interfaces';


const serialize = (user : CreateUserAttrs) => {
    return {
        username : user.username,
        password : user.password
    }
}

export const getUserByUsername = async (username: string) => {};

export const getUserById = async (id: string) => {};

export const createUser = async (attrs: CreateUserAttrs) => {
    const id = genId()
    await client.HSET(
        usersKey(id),
        serialize(attrs)
    )

    return id
};


 