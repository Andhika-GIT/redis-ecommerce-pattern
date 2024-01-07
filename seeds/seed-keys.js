// Sessions
export const sessionKey = (sessionId) => `sessions#${sessionId}`;

// Cache
export const pageCacheKey = (route) => `pagecache#${route}`;

// Users
export const usersKey = (userId) => `users#${userId}`;
export const usernamesKey = () => 'usernames';
export const usernameUniquekey = () => 'usernames:unique';
export const usersItemsKey = (userId) => `users:items#${userId}`;
export const usersBidsKey = (userId) => `users:bids#${userId}`;
export const userLikesKey = (userId) => `users:likes#${userId}`;

// Items
export const itemKey = (itemId) => `item#${itemId}`;
export const itemByViewsKey = () => 'items:views';
export const itemByBidsKey = () => 'items:bids';
export const itemByEndingAtKey = () => 'items:endingAt';
export const itemByPriceKey = () => 'items:price';
export const itemUniqueViewsKey = (userId) => `items:views#${userId}`;
export const itemBidHistoryKey = (itemId) => `history#${itemId}`;
export const itemViewsKey = (itemId) => `items:views#${itemId}`;
export const itemIndexKey = () => 'idx:items';
