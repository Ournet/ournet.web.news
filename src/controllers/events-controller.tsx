import * as React from 'react';
import { NextFunction } from "express";
import { maxageIndex } from '../maxage';
import { ImportantViewModelInput, ImportantViewModel, ImportantViewModelBuilder } from '../view-models/important-view-model';
import { createQueryApiClient } from '../data/api';
import { renderPage } from '../renderer';
import ImportantPage from '../views/important/important-page';


export function importantHandler(input: ImportantViewModelInput, next: NextFunction) {
    const api = createQueryApiClient<ImportantViewModel>();

    maxageIndex(input.res);

    new ImportantViewModelBuilder(input, api)
        .build()
        .then(data => renderPage(input.res, <ImportantPage {...data} />))
        .catch(next);
}
