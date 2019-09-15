import { validateSync } from 'class-validator';

import { ClassValidationError } from '../custom-errors/ClassValidationError';

/**
 * Returns the class if its validation decorators succeed
 *
 * Otherwise, throws a ClassValidationError with useful info
 * @param classNeedingValidation
 */
function ValidateClass<T>(classNeedingValidation: T): T {
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
