import DraftTFClass from '../../../Common/Enums/DraftTFClass';

const GetAllDraftTFClasses = (): DraftTFClass[] => {
	return Object.keys(DraftTFClass).map((key: never) => DraftTFClass[key] as DraftTFClass);
};

export default GetAllDraftTFClasses;
