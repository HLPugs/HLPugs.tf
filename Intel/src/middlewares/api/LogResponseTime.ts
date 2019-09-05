import { Request, Response, NextFunction } from 'express';
import { ExpressMiddlewareInterface, Middleware } from 'routing-controllers';
import { FgGreen, FgYellow, FgRed, Reset, FgBlue, Bold } from '../../utils/ConsoleColors';

@Middleware({ type: 'before' })
class LogResponseTime implements ExpressMiddlewareInterface {
	use(req: Request, res: Response, next: NextFunction): void {
		const startTime = process.hrtime();
		res.on('finish', () => {
			const elapsedTime = process.hrtime(startTime);
			const elapsedTimeInMs = Math.round(elapsedTime[0] * 1000 + elapsedTime[1] / 1e6);
			const color = elapsedTimeInMs < 10 ? FgGreen : elapsedTimeInMs < 100 ? FgYellow : FgRed;
			console.log(Reset, `${FgBlue}${Bold}${req.method}${Reset} ${req.path}`, color, `+${elapsedTimeInMs}ms`, Reset);
		});
		next();
	}
}

export default LogResponseTime;
