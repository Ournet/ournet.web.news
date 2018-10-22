
import { Express } from 'express'

import redirectRoute from './redirects'
import homeRoute from './home'
import quotesRoute from './quotes'
import eventsRoute from './events'
import itemsRoute from './items'
import rssRoute from './rss'
import actionsRoute from './actions'

export default function (app: Express) {
    app.use(redirectRoute);
    app.use(homeRoute);
    app.use(quotesRoute);
    app.use(eventsRoute);
    app.use(itemsRoute);
    app.use(rssRoute);
    app.use(actionsRoute);
}
