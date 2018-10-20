
import { Router } from 'express';
import { LOCALE_ROUTE_PREFIX } from '../utils';
import { itemHandler } from '../controllers/items.controller';

const route: Router = Router();

export default route;

// item
route.get(`/:ul${LOCALE_ROUTE_PREFIX}?/item/:id([a-z0-9]+)`, (req, res, next) =>
    itemHandler({ req, res, id: req.params.id }, next));


