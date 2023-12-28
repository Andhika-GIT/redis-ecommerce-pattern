export const pageCacheKey = (id: string) => `pagecache#${id}`;
export const usersKey = (userId: string) => `users#${userId}`;
export const sessionKey = (sessionId: string) => `session#${sessionId}`;
export const itemKey = (itemId: string) => `item#${itemId}`;
export const usernameUniquekey = () => 'usernames:unique'
export const userLikesKey = (userId: string) => `users:likes#${userId}`
