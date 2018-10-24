import * as React from 'react';
import logger from './logger';
import { maxage } from './maxage';
import { Request, Response } from "express";
import env from './env';
import { boomify } from 'boom';
import { ErrorViewModel, ErrorViewModelBuilder } from './view-models/error-view-model';
import { createQueryApiClient } from './data/api';
import { renderPage } from './renderer';
import ErrorPage from './views/error-page';

export default function catchError(req: Request, res: Response, error: any) {
    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

    logger.error(error.message || 'errorHandler', {
        hostname: req.hostname,
        url: req.originalUrl,
        error: error,
        ip: ip,
        ref: req.get('Referrer')
    });

    // if (!env.isProduction) {
    //     return res.send({ error: error })
    // }

    maxage(res, 1);

    const boomError = boomify(error);

    res.status(boomError.output.statusCode);

    const api = createQueryApiClient<ErrorViewModel>();

    new ErrorViewModelBuilder({ req, res, error }, api)
        .build()
        .then(data => renderPage(res, <ErrorPage { ...data } />, data.redirect))
        .catch(e => {
            logger.error(e);
            res.end();
        });
}