import { IsString, IsDefined, MinLength, MaxLength } from 'class-validator';
import { MIN_ALIAS_LENGTH, MAX_ALIAS_LENGTH } from '../Constants/AliasConstraints';

export default class SubmitAliasRequest {
	@IsString()
	@IsDefined()
	@MinLength(MIN_ALIAS_LENGTH)
	@MaxLength(MAX_ALIAS_LENGTH)
	alias: string;
}
