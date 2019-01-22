import { Request, Response } from 'express';
import Explorer from '../services/explorer';
import logger from '../utils/logger';

/**
 * Query a collection
 *
 * @param req
 * @param res
 */
export const query = async (req: Request, res: Response) => {
  try {
    const { collectionId, bodyField, text, options } = req.body;
    const result = await Explorer.query(collectionId, bodyField, text, options);
    res.send(result);
  } catch (err) {
    logger.error(err);
    res.status(500).send(err);
  }
};

/**
 * List collections
 *
 * @param req
 * @param res
 */
export const collections = async (req: Request, res: Response) => {
  try {
    const result = await Explorer.listCollections();
    res.send(result);
  } catch (err) {
    logger.error(err);
    res.status(500).send(err);
  }
};
