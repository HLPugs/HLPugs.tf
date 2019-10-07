import { validateSync, ValidationError } from 'class-validator';

import { ClassValidationError } from '../custom-errors/ClassValidationError';
import Logger from '../modules/Logger';

/**
 * Returns the class if its validation decorators succeed
 *
 * Otherwise, throws a ClassValidationError with useful info
 * @param classNeedingValidation
 */
function ValidateClass<T>(classNeedingValidation: T): T {
	if (classNeedingValidation === null || classNeedingValidation === undefined) {
		const error = new ValidationError();
		error.value = 'Cannot validate null or undefined';
		throw new ClassValidationError([error]);
	}
	if (Array.isArray(classNeedingValidation)) {
		classNeedingValidation.forEach(x => {
			const errors = validateSync(classNeedingValidation);
			if (errors.length) {
				throw new ClassValidationError(errors);
			}
		});
		return classNeedingValidation;
	} else {
		const errors = validateSync(classNeedingValidation);
		if (errors.length) {
			throw new ClassValidationError(errors);
		}
		return classNeedingValidation;
	}
}

export default ValidateClass;
