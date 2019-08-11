import { Middleware, ExpressErrorMiddlewareInterface, NotFoundError } from 'routing-controllers';
import { Response, Request, NextFunction } from 'express';

@Middleware({ type: 'after' })
export default class DisplayErrorDuringDevelopment implements ExpressErrorMiddlewareInterface {
    error(error: any, req: Request, res: Response, next: NextFunction) {
        const obj = {
            path: req.route.path,
            error: error.stack,
        }
        console.error(error.stack);
        res.send(`<h1>Error accessing: ${obj.path}<br>Error: <code>${error} ${error.stack ? error.stack : ''}</code></h1>`)
        next();
    }
}