
import { Express } from 'express'

import redirectRoute from './redirects'
import homeRoute from './home'
import quotesRoute from './quotes'
import eventsRoute from './events'
import itemsRoute from './items'
import rssRoute from './rss'

export default function (app: Express) {
    app.use(redirectRoute);
    app.use(homeRoute);
    app.use(quotesRoute);
    app.use(eventsRoute);
    app.use(itemsRoute);
    app.use(rssRoute);
}
