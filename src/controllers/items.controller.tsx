import * as React from 'react';
import { NextFunction } from "express";
import { maxage } from '../maxage';
import { createQueryApiClient } from '../data/api';
import { renderPage } from '../renderer';
import ItemPage from '../views/item/item-page';
import { ItemViewModelBuilder, ItemViewModel, ItemViewModelInput } from '../view-models/item-view-model';


export function itemHandler(input: ItemViewModelInput, next: NextFunction) {
    const api = createQueryApiClient<ItemViewModel>();

    maxage(input.res, 30);

    new ItemViewModelBuilder(input, api)
        .build()
        .then(data => renderPage(input.res, <ItemPage {...data} />, data.redirect))
        .catch(next);
}
