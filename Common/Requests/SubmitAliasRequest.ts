import { IsString, IsDefined, MinLength, MaxLength } from 'class-validator';

export default class SubmitAliasRequest {
	@IsString()
	@IsDefined()
	@MinLength(2)
	@MaxLength(17)
	alias: string;
}
