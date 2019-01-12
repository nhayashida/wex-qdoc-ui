import { Request, Response } from 'express';
import Explorer from '../services/explorer';

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
    res.status(500).send(err);
  }
};

/**
 * Query a collection
 *
 * @param req
 * @param res
 */
export const query = async (req: Request, res: Response) => {
  try {
    const { collectionId, bodyField, q } = req.body;
    const result = await Explorer.query(collectionId, bodyField, q);
    res.send(result);
  } catch (err) {
    res.status(500).send(err);
  }
};

export default { collections, query };
