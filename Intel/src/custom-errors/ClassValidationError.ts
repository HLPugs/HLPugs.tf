import { ValidationError } from 'class-validator';
import Logger from '../modules/Logger';

export class ClassValidationError extends Error {
	constructor(errors: ValidationError[]) {
		super(errors.toString());
		this.name = 'ClassValidationError';
		this.errors = errors;
		const errorMessages = errors.toString().split('\n,');
		this.message = '';
		errors.forEach((err, i) => {
			let errorMessage =
				i === 0
					? errorMessages[i]
					: errorMessages[i].substring(errorMessages[i].indexOf(':\n') + 1, errorMessages[i].length);

			const value = ' for value ' + err.value === undefined ? 'undefined' : JSON.stringify(err.value);

			let constraintCount = 0;
			for (const constraint in err.constraints) {
				constraintCount++;
			}

			errorMessage = errorMessage.trim();
			if (constraintCount > 1) {
				errorMessages[i] = `${errorMessage} ${value}\n`;
			} else {
				errorMessages[i] += ` ${value}\n`;
			}
		});
		this.message = errorMessages
			.toString()
			.replace(',\n', '')
			.replace(',-', ' -');

		Error.captureStackTrace(this, ClassValidationError);
		this.message = this.stack || this.message;
		console.error(this);
	}

	errors: ValidationError[];
}
