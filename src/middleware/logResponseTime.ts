import { Request, Response, NextFunction } from 'express';

export const logResponseTime = (req: Request, res: Response, next: NextFunction): void => {
  const startTime = process.hrtime();
  res.on('finish', () => {
    const elapsedTime = process.hrtime(startTime);
    const elapsedTimeInMs = Math.round(elapsedTime[0] * 1000 + elapsedTime[1] / 1e6);
    console.log(`${req.method} ${req.path} ${elapsedTimeInMs}ms`);
  });
  next();
};
