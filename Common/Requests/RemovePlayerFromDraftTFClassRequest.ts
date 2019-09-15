import { IsEnum } from 'class-validator';
import DraftTFClass from '../Enums/DraftTFClass';

export default class RemovePlayerFromDraftTFClassRequest {
    @IsEnum(DraftTFClass)
    draftTFClass: DraftTFClass;
}
