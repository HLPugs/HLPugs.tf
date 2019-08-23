import { Middleware, ExpressErrorMiddlewareInterface, NotFoundError } from 'routing-controllers';
import { Response, Request, NextFunction } from 'express';

@Middleware({ type: 'after' })
export default class DisplayErrorDuringDevelopment implements ExpressErrorMiddlewareInterface {
	error(error: any, req: Request, res: Response, next: NextFunction) {
		const obj = {
			path: req.route.path,
			error: error.stack,
		}

		console.error(obj.error);
	}
}