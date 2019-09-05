import { Middleware, ExpressErrorMiddlewareInterface, HttpError } from 'routing-controllers';
import { Response, Request, NextFunction } from 'express';
import { ValidationError } from 'class-validator';
import { ErrorModel } from '../../../Common/Models/ErrorModel';

@Middleware({ type: 'after' })
export default class ErrorHandler implements ExpressErrorMiddlewareInterface {
	error(error: any, req: Request, res: Response, next: NextFunction) {
		const responseObject = new ErrorModel();
		console.error(error);

		// if its an array of ValidationError
		const developmentMode: boolean = process.env.NODE_ENV === 'dev';
		if (Array.isArray(error) && error.every(element => element instanceof ValidationError)) {
			res.status(400);
			responseObject.message = "You have an error in your request's body. Check 'errors' field for more details!";
			responseObject.errors = error;
		} else if ((error as any).name === 'ClassValidationError') {
			res.status(400);
			responseObject.message = error.message;
		} else {
			// set http status
			if (error instanceof HttpError && error.httpCode) {
				res.status(error.httpCode);
				responseObject.httpCode = error.httpCode;
			} else {
				res.status(500);
				responseObject.httpCode = 500;
			}

			if (error instanceof Error) {
				if (error.name && (developmentMode || error.message)) {
					// show name only if in development mode and if error message exists
					responseObject.name = error.name;
				}
				if (error.message) {
					responseObject.message = error.message;
				}
				if (error.stack && developmentMode) {
					responseObject.stack = error.stack;
				}
			} else if (typeof error === 'string') {
				responseObject.message = error;
			}
		}

		res.json(responseObject);
	}
}
