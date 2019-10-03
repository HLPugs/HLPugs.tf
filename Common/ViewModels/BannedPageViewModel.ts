import SteamID from '../Types/SteamID';
import Punishment from '../../Intel/src/entities/Punishment';
import ValidateClass from '../../Intel/src/utils/ValidateClass';
import { IsNumberString, IsString, IsNotEmpty, IsDefined, IsDate, MaxDate, MinDate } from 'class-validator';

export default class BannedPageViewModel {
	@IsNumberString()
	creatorSteamid: string;

	@IsString()
	@IsNotEmpty()
	reason: string;

	@IsDate()
	@MaxDate(new Date())
	creationDate: Date;

	@IsDate()
	expirationDate: Date;

	static fromBan(ban: Punishment) {
		const bannedPageViewModel = new BannedPageViewModel();
		bannedPageViewModel.creationDate = ban.creationDate;
		bannedPageViewModel.creatorSteamid = ban.creator.steamid;
		bannedPageViewModel.expirationDate = ban.expirationDate;
		bannedPageViewModel.reason = ban.reason;
		return ValidateClass(bannedPageViewModel);
	}
}
