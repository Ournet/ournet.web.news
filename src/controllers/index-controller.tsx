
import * as React from 'react';
import { NextFunction } from "express";
import { IndexViewModel, IndexViewModelBuilder, IndexViewModelInput } from "../view-models/index-view-model";
import { createQueryApiClient } from "../data/api";
import { renderPage } from "../renderer";
import IndexPage from "../views/index/index-page";
import { maxageIndex } from '../maxage';

export function indexHandler(input: IndexViewModelInput, next: NextFunction) {
    const api = createQueryApiClient<IndexViewModel>();

    maxageIndex(input.res);

    new IndexViewModelBuilder(input, api)
        .build()
        .then(data => renderPage(input.res, <IndexPage {...data} />))
        .catch(next);
}
