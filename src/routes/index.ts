
import redirectRoute from './redirects'
import homeRoute from './home'
import { Express } from 'express'

export default function (app: Express) {
    app.use(redirectRoute);
    app.use(homeRoute);
}
