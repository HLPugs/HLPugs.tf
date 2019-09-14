import { IsNumber, IsString, IsNotEmpty, IsEnum, IsNumberString, IsBoolean, IsDate } from 'class-validator';
import Region from '../Enums/Region';
import SteamID from '../Types/SteamID';

export default class CreateAnnouncementRequest {
	@IsString()
	@IsNotEmpty()
	messageContent: string;

	@IsNumber()
	order: number;

	@IsEnum(Region)
	region: Region;

	@IsBoolean()
	priority: boolean;
}
