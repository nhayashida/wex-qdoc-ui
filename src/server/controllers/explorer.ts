import { NextFunction, Request, Response } from 'express';
import explorer from '../services/explorer';
import logger from '../utils/logger';

/**
 * Query a collection
 *
 * @param req
 * @param res
 * @param next
 */
export const query = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await explorer.query(req.body);
    res.send(result);
  } catch (err) {
    logger.error(err);
    next(err);
  }
};

/**
 * List collections
 *
 * @param req
 * @param res
 * @param next
 */
export const collections = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await explorer.listCollections();
    res.send(result);
  } catch (err) {
    logger.error(err);
    next(err);
  }
};
