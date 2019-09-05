import { IsEnum } from 'class-validator';
import DraftTFClass from '../Enums/DraftTFClass';

export default class RemovePlayerFromDraftTFClassDTO {
    @IsEnum(DraftTFClass)
    draftTFClass: DraftTFClass;
}
