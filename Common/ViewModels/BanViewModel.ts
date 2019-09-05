import SteamID from '../Types/SteamID';

class BanViewModel {
	id: number;
	creatorSteamid: SteamID;
	reason: string;
	expirationDate: Date;
}

export default BanViewModel;
