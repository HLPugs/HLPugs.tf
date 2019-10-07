import Logger from '../modules/Logger';

class PlayerNotFoundError extends Error {
	constructor(identifier: string) {
		super(identifier);
		this.name = 'PlayerNotFoundError';
		this.message = `Player ("${identifier}") does not exist`;
		Error.captureStackTrace(this, PlayerNotFoundError);
		console.error(this);
		Logger.logError(this.stack);
	}
}

export default PlayerNotFoundError;
