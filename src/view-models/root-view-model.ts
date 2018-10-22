
import { Sitemap, sitemap, getSchema, getHost } from "ournet.links";
import { Request, Response } from "express";
import { AppConfig, initAppConfig } from "../config";
import { initLocale, I18nFn } from "../locale";
import { OurnetProjects } from "../data/common";
import { RedirectInfo } from "../renderer";
const version = require('../../package.json').version;
import * as moment from 'moment-timezone';

export class RootModelBuilder<T extends RootViewModel, I extends RootViewModelInput> {
    protected model: T;

    constructor(protected input: I) {
        const config = initAppConfig(input.req);
        const locale = initLocale(input.req, input.res, config);

        this.model = {
            __: input.req.__,
            config,
            lang: locale.lang,
            country: locale.country,
            links: sitemap(config.languages[0]),
            version,
            project: OurnetProjects.news,
            schema: getSchema(OurnetProjects.news, locale.country),
            host: getHost(OurnetProjects.news, locale.country),
            currentDate: moment().tz(config.timezone).locale(locale.lang),
        } as T;
    }

    build(): T | Promise<T> {
        return this.model;
    }
}

export interface RootViewModelInput {
    req: Request
    res: Response
}

export interface RootViewModel {
    lang: string
    country: string
    config: AppConfig
    links: Sitemap
    __: I18nFn
    version: string
    project: OurnetProjects
    schema: string
    host: string
    currentDate: moment.Moment
    redirect?: RedirectInfo
}
