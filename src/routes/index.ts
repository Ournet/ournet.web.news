
import redirectRoute from './redirects'
import homeRoute from './home'
import quotesRoute from './quotes'
import { Express } from 'express'

export default function (app: Express) {
    app.use(redirectRoute);
    app.use(homeRoute);
    app.use(quotesRoute);
}
