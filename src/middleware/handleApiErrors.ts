import logger                     from '../modules/logger';
import { Request, Response, NextFunction } from 'express';

export const handleApiErrors = function (e: Error, req: Request, res: Response, next: NextFunction) {
  // TODO
  res.status(500).send(e);
  next();
};
