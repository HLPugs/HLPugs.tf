import SteamID from '../Types/SteamID';
import { MinDate, IsEnum, IsNumberString, IsString, IsDate } from 'class-validator/decorator/decorators';
import PunishmentType from '../Enums/PunishmentType';
import ValidateClass from '../../Intel/src/utils/ValidateClass';
import BannedPageViewModel from '../ViewModels/BannedPageViewModel';

export default class Punishment {
	@IsEnum(PunishmentType)
	punishmentType: PunishmentType;

	@IsNumberString()
	offenderSteamID: SteamID;

	@IsNumberString()
	authorSteamID: SteamID;

	@IsString()
	reason: string;

	@IsDate()
	@MinDate(new Date())
	expirationDate: Date;

	@IsDate()
	creationDate: Date;

	@IsDate()
	lastModifiedDate: Date;

	static toBannedPageViewModel(punishment: Punishment) {
		return ValidateClass<BannedPageViewModel>({
			creationDate: punishment.creationDate,
			creatorSteamid: punishment.authorSteamID,
			expirationDate: punishment.expirationDate,
			reason: punishment.reason
		});
	}
}
