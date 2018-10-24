import { NewsViewModel, NewsViewModelBuilder } from "./news-view-model";
import { PageViewModelInput } from "./page-view-model";
import { NewsEvent, NewsEventStringFields } from "@ournet/api-client";
import logger from "../logger";

export interface ErrorViewModelInput extends PageViewModelInput {
    error: Error
}

export interface ErrorViewModel extends NewsViewModel {
    latestEvents: NewsEvent[]
    error: Error
}

export class ErrorViewModelBuilder extends NewsViewModelBuilder<ErrorViewModel, ErrorViewModelInput> {
    async build() {
        this.model.error = this.input.error;
        const { lang, country } = this.model;

        this.api.newsEventsLatest('latestEvents', { fields: NewsEventStringFields }, { params: { lang, country, limit: 4 } });

        try {
            return await super.build();
        } catch (e) {
            logger.error(e);
            return this.model;
        }
    }

    protected formatModel(data: ErrorViewModel) {

        this.model.latestEvents = data.latestEvents || [];

        return super.formatModel(data);
    }
}
