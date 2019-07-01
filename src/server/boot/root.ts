import bparser from 'body-parser';
import path from 'path';
import { Request, Response, Router } from 'express';
import { query, collections } from '../controllers/wex.controller';

const root = async app => {
  const router: Router = app.loopback.Router();
  router.get('/', (req: Request, res: Response) => res.redirect('/wex'));
  router.get('/healthy', app.loopback.status());
  router.get('/wex', (req, res) => {
    res.sendFile(path.join(__dirname, '../../../dist', 'index.html'));
  });
  router.get('/wex/collections/:collectionId/query', bparser.json(), query);
  router.get('/wex/collections', collections);
  app.use(router);
};

export default root;
