export class PlayerNotFoundError extends Error {
	constructor(steamid: string) {
		super(steamid);
		this.name = 'PlayerNotFoundError';
		this.message = `Player with steamid "${steamid}" does not exist`;
		Error.captureStackTrace(this, PlayerNotFoundError);
	}
}
