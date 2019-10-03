import { IsString, IsDefined, MaxLength, MinLength } from 'class-validator';

export default class CheckIfAliasIsTakenRequest {
	@IsString()
	@IsDefined()
	@MinLength(2)
	@MaxLength(17)
	alias: string;
}
