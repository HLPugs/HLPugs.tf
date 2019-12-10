import SteamID from '../Types/SteamID';
import PunishmentEntity from '../../Intel/src/entities/PunishmentEntity';
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
}
