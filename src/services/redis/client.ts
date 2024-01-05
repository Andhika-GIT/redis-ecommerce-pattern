import { createClient, defineScript } from 'redis';

const client = createClient({
	socket: {
		host: process.env.REDIS_HOST,
		port: parseInt(process.env.REDIS_PORT)
	},
	password: process.env.REDIS_PW,
	scripts: {
		unlock: defineScript({
			NUMBER_OF_KEYS: 1,
			transformArguments(key: string, token: string) {
				return [key, token];
			},
			transformReply(reply: any) {
				return reply;
			},
			SCRIPT: `
			if redis.call('GET', KEYS[1]) == ARGV[1] then
				return redis.call('DEL',KEYS[1])
			end
			`
		})
	}
});

client.on('error', (err) => console.error(err));
client.connect();

export { client };
