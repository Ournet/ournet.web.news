import * as React from 'react';
import { NextFunction } from "express";
import { createQueryApiClient } from '../data/api';
import { renderPage } from '../renderer';
import { maxage } from '../maxage';
import { TopicViewModelBuilder, TopicViewModel, TopicViewModelInput } from '../view-models/topic-view-model';
import TopicPage from '../views/topic/topic-page';


export function topicHandler(input: TopicViewModelInput, next: NextFunction) {
    const api = createQueryApiClient<TopicViewModel>();

    maxage(input.res, 30);

    new TopicViewModelBuilder(input, api)
        .build()
        .then(data => renderPage(input.res, <TopicPage {...data} />, data.redirect))
        .catch(next);
}
