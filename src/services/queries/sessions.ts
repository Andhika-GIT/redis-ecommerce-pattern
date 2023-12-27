import { sessionKey } from '$services/keys';
import { client } from '$services/redis';
import type { Session } from '$services/types';
import { genId } from '$services/utils';

const serialize = (session : Session) => {
    return {
        userId : session.userId,
        username : session.username
    }
}

const deserialize = (id: string, session : {[key: string] : string}) => {
    return {
        id,
        userId: session.userId,
        username : session.username
    }
}



export const getSession = async (id: string) => {
    const session = await client.HGETALL(sessionKey(id))

    // check if session is empty object or null
    if (Object.keys(session).length === 0) {
        return null
    }

    return deserialize(id, session)
};

export const saveSession = async (session: Session) => {
    await client.HSET(
        sessionKey(session.id),
        serialize((session))
    )

    return session.id
};
