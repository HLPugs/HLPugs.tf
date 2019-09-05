import { IsEnum } from 'class-validator';
import DraftTFClass from '../Enums/DraftTFClass';

export default class GetDraftTFClassListDTO {
    @IsEnum(DraftTFClass)
    draftTFClass: DraftTFClass;
}
