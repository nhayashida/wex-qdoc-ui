import { NextFunction, Request, Response } from 'express';
import explorer from '../services/wex';
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
    const { collectionId } = req.params;
    const result = await explorer.query({ collectionId, ...req.query });
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
    res.send({ collections: result });
  } catch (err) {
    logger.error(err);
    next(err);
  }
};
