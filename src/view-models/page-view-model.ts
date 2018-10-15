
import { RootViewModel, RootViewModelInput } from "./root-view-model";
import { AsyncViewModelBuilder } from "./async-view-model";
import { OurnetQueryApi } from "@ournet/api-client";
import { getSchema, getHost } from "ournet.links";

export class PageViewModelBuilder<T extends PageViewModel, I extends PageViewModelInput> extends AsyncViewModelBuilder<T, I>{
    constructor(input: I, api: OurnetQueryApi<T>) {
        super(input, api);

        this.model.head = {
            title: this.model.config.name,
            elements: [],
        };
    }

    setCanonical(link: string) {
        const { country, project } = this.model;
        this.model.head.canonical = getSchema(project, country) + '//' + getHost(project, country) + link;
    }
}

export interface PageViewModelInput extends RootViewModelInput {

}

export interface PageViewModel extends RootViewModel {
    head: PageHeadViewData
}

export interface PageHeadViewData {
    title: string
    description?: string
    elements: JSX.Element[]
    canonical?: string
}
