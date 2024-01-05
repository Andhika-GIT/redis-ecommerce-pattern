import { randomBytes } from 'crypto';
import { client } from './client';

// AVOID RACE CONDITION WITH LOCK

export const withLock = async (key: string, cb: () => any) => {
	// initialize retry delay in miliseconds and retry
	const retryDelayMs = 200;
	let retries = 20;

	// generate a random value to store at the lock key
	const token = randomBytes(6).toString('hex');
	// create the lock key
	const lockKey = `lock:${key}`;

	// while loop to implement retry behavior
	while (retries >= 0) {
		// decrease the retries everytime this loop run again
		retries--;

		// try to create the lock key y
		const success = await client.SET(lockKey, token, {
			// with NX, to avoid duplicate item with same ke
			NX: true,
			// with PX, for expires time, to unset or delete the key if there's something wrong
			PX: 2000
		});

		// if failed, run the pause for delay, and continue
		if (!success) {
			await pause(retryDelayMs);
			continue;

			// since we run continue, the while loop gonna be retry from top again, and skip the action below
		}

		try {
			// if successful, run the callback function
			const result = await cb();
			// return the result
			return result;
		} finally {
			// finally block, whenever the function goes right or wrong, keep unset the key
			// unset or delete the lock key
			await client.unlock(lockKey, token);
		}
	}
};

const buildClientProxy = () => {};

const pause = (duration: number) => {
	return new Promise((resolve) => {
		setTimeout(resolve, duration);
	});
};
