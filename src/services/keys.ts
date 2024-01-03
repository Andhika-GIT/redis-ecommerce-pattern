export const pageCacheKey = (id: string) => `pagecache#${id}`;
export const usersKey = (userId: string) => `users#${userId}`;
export const sessionKey = (sessionId: string) => `session#${sessionId}`;

export const usernameUniquekey = () => 'usernames:unique';
export const userLikesKey = (userId: string) => `users:likes#${userId}`;
export const usernamesKey = () => 'usernames';

// items
export const itemKey = (itemId: string) => `item#${itemId}`;
export const itemByViewsKey = () => 'items:views';
export const itemByEndingAtKey = () => 'items:endingAt';
export const itemByPriceKey = () => 'items:price'
export const itemUniqueViewsKey = (userId: string) => `items:views#${userId}`;
export const itemBidHistoryKey = (itemId: string) => `history#${itemId}`;
