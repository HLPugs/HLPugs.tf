import * as connect_redis  from 'connect-redis';
import * as expressSession from 'express-session';

export const store = process.env.NODE_ENV === 'production' ?
    connect_redis(expressSession) :
    new expressSession.MemoryStore();
