
import { Express } from 'express'

import redirectRoute from './redirects'
import homeRoute from './home'
import quotesRoute from './quotes'
import eventsRoute from './events'

export default function (app: Express) {
    app.use(redirectRoute);
    app.use(homeRoute);
    app.use(quotesRoute);
    app.use(eventsRoute);
}
