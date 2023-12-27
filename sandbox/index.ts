import 'dotenv/config';
import { client } from '../src/services/redis';

const run = async () => {
	await client.HSET('car1', {
		color: 'red',
		year: 1950
	});
	await client.HSET('car2', {
		color: 'blue',
		year: 1951
	});
	await client.HSET('car3', {
		color: 'green',
		year: 1952
	});

	const results = await Promise.all([
		client.HGETALL('car1'),
		client.HGETALL('car2'),
		client.HGETALL('car3')
	]);

	console.log(results);
};
run();
