
import { Router } from 'express';
import { LOCALE_ROUTE_PREFIX } from '../utils';
import { importantHandler, eventHandler } from '../controllers/events-controller';

const route: Router = Router();

export default route;

// /important
route.get(`/:ul${LOCALE_ROUTE_PREFIX}?/important`, (req, res, next) =>
    importantHandler({ req, res }, next));

// /story
route.get(`/:ul${LOCALE_ROUTE_PREFIX}?/story/:slug-:id([a-z0-9]+)`, (req, res, next) =>
    eventHandler({ req, res, id: req.params.id }, next));


