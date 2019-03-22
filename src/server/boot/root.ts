import bparser from 'body-parser';
import path from 'path';
import { Request, Response, Router } from 'express';
import { query, collections } from '../controllers/explorer';

const root = async app => {
  const router: Router = app.loopback.Router();
  router.get('/', (req: Request, res: Response) => res.redirect('/explorer'));
  router.get('/healthy', app.loopback.status());
  router.get('/explorer', (req, res) => {
    res.sendFile(path.join(__dirname, '../../../dist', 'index.html'));
  });
  router.post('/explorer/query', bparser.json(), query);
  router.get('/explorer/collections', collections);
  app.use(router);
};

export default root;
