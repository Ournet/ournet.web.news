
import { Router } from 'express';
import { LOCALE_ROUTE_PREFIX } from '../utils';
import { topicHandler } from '../controllers/topics-controller';

const route: Router = Router();

export default route;

// /topic
route.get(`/:ul${LOCALE_ROUTE_PREFIX}?/topic/:slug`, (req, res, next) =>
    topicHandler({ req, res, slug: req.params.slug }, next));



