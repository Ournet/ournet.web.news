import * as React from 'react';
import { NextFunction } from "express";
import { maxageIndex, maxage } from '../maxage';
import { ImportantViewModelInput, ImportantViewModel, ImportantViewModelBuilder } from '../view-models/important-view-model';
import { createQueryApiClient } from '../data/api';
import { renderPage } from '../renderer';
import ImportantPage from '../views/important/important-page';
import { EventViewModelInput, EventViewModel, EventViewModelBuilder } from '../view-models/event-view-model';
import EventPage from '../views/event/event-page';


export function importantHandler(input: ImportantViewModelInput, next: NextFunction) {
    const api = createQueryApiClient<ImportantViewModel>();

    maxageIndex(input.res);

    new ImportantViewModelBuilder(input, api)
        .build()
        .then(data => renderPage(input.res, <ImportantPage {...data} />, data.redirect))
        .catch(next);
}

export function eventHandler(input: EventViewModelInput, next: NextFunction) {
    const api = createQueryApiClient<EventViewModel>();

    maxage(input.res, 10);

    new EventViewModelBuilder(input, api)
        .build()
        .then(data => renderPage(input.res, <EventPage {...data} />, data.redirect))
        .catch(next);
}
