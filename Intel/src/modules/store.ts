import * as connectRedis from 'connect-redis';
import * as expressSession from 'express-session';

export const store =
	process.env.NODE_ENV === 'production'
		? connectRedis(expressSession)
		: new expressSession.MemoryStore();
