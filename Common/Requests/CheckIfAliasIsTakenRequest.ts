import { IsString, IsDefined, MaxLength, MinLength } from 'class-validator';
import { MIN_ALIAS_LENGTH, MAX_ALIAS_LENGTH } from '../Constants/AliasConstraints';

export default class CheckIfAliasIsTakenRequest {
	@IsString()
	@IsDefined()
	@MinLength(MIN_ALIAS_LENGTH)
	@MaxLength(MAX_ALIAS_LENGTH)
	alias: string;
}
