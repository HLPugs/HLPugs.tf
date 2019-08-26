import { validateSync } from 'class-validator';

import { ClassValidationError } from '../custom-errors/ClassValidationError';

const ValidateClass = (obj: any) => {
	const errors = validateSync(obj);
	if (errors.length) {
		throw new ClassValidationError(errors);
	}
}

export default ValidateClass;