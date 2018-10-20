
import * as React from 'react';
import { NextFunction } from "express";
import { createQueryApiClient } from "../data/api";
import { renderPage } from "../renderer";
import { maxageIndex } from '../maxage';
import { QuotesViewModelBuilder, QuotesViewModelInput, QuotesViewModel } from '../view-models/quotes-view-model';
import QuotesPage from '../views/quotes/quotes-page';

export function quotesHandler(input: QuotesViewModelInput, next: NextFunction) {
    const api = createQueryApiClient<QuotesViewModel>();

    maxageIndex(input.res);

    new QuotesViewModelBuilder(input, api)
        .build()
        .then(data => renderPage(input.res, <QuotesPage {...data} />, data.redirect))
        .catch(next);
}
