import { ValidationError } from 'class-validator';

export class ClassValidationError extends Error {
	constructor(errors: ValidationError[]) {
		super(errors.toString());
		this.name = 'ClassValidationError';
		this.errors = errors;
		Error.captureStackTrace(this, ClassValidationError);
		console.error(this);
	}

	errors: ValidationError[];
}
