import { IsEnum } from 'class-validator';
import DraftTFClass from '../Enums/DraftTFClass';

export default class AddToDraftTFClassListDTO {
    @IsEnum(DraftTFClass)
    draftTFClass: DraftTFClass;
}
