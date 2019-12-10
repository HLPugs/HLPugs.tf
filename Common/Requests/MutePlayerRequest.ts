import SteamID from '../Types/SteamID';

export default class MutePlayerRequest {
	playerToMuteSteamID: SteamID;
	expirationDate: Date;
	reason: string;
}
