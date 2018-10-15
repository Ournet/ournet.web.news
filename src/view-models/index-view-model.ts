
import { NewsViewModel, NewsViewModelBuilder } from "./news-view-model";
import { PageViewModelInput } from "./page-view-model";
import { LocalesNames, LocalesHelper } from "../locales-names";
import * as util from 'util';

export interface IndexViewModelInput extends PageViewModelInput {

}

export interface IndexViewModel extends NewsViewModel {
    
}

export class IndexViewModelBuilder extends NewsViewModelBuilder<IndexViewModel, IndexViewModelInput> {

    build() {

        const { lang, links, __, head, country } = this.model;

        head.title = util.format(__(LocalesNames.site_title), LocalesHelper.getCountryName(__, country));
        head.description = util.format(__(LocalesNames.site_description), LocalesHelper.getInCountryName(__, country));

        this.setCanonical(links.news.home({ ul: lang }));
        
        return super.build();
    }

    protected formatModel(data: IndexViewModel) {

        return super.formatModel(data);
    }
}
