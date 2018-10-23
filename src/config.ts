import { readFileSync } from "fs";
import { join } from "path";
import { Request } from "express";
import { OurnetProjects } from "./data/common";

const CONFIGS: { [country: string]: AppConfig } = {};
const baseConfig: AppConfig = require('../config/index.json');

const hosts: { [index: string]: string } = {
    'news.ournet.ro': 'ro',
    'news.zborg.ru': 'ru',
    'news.ournet.cz': 'cz',
    'news.ournet.in': 'in',
    'news.ournet.it': 'it',
    'news.click.md': 'md',
};

export function getSupportedCountries() {
    return ['ro', 'ru', 'bg', 'cz', 'in', 'it', 'md']
}

function getCountry(req: Request) {
    return hosts[req.hostname] || process.env.COUNTRY;
}

export function initAppConfig(req: Request): AppConfig {
    const country = getCountry(req);
    if (!country) {
        throw new Error(`Invalid hostname: ${req.hostname}`);
    }
    return getAppConfig(country);
}

export function getAppConfig(country: string): AppConfig {
    if (!country) {
        throw new Error('Loading config for NO country');
    }
    if (!CONFIGS[country]) {
        const countryConfig = JSON.parse(readFileSync(join(__dirname, '..', 'config', country + '.json'), 'utf8'));
        CONFIGS[country] = { ...baseConfig, ...countryConfig };
    }

    return CONFIGS[country];
}

export interface AppConfig {
    project: OurnetProjects
    name: string
    country: string
    languages: string[]
    host: string
    domain: string
    capitalId: string
    projects: string[]
    email: string
    internationalIds: string[]
    shareServices: string[]
    timezone: string
    googleAnalyticsId: string

    assets: {
        css: {
            main: string,
            errorPage: string,
            gallery: string,
        },
        js: {
            main: string,
            gallery: string,
        }
    },
    oneSignal?: {
        appId: string
        safari_web_id: string
    },
    facebookId: string,
}

export function getFavicon(config: AppConfig, filename?: string) {
    filename = filename || 'favicon.ico';

    var name = config.domain.split('.')[0];
    name = ['click', 'zborg', 'diez'].indexOf(name) > -1 ? name : 'ournet';

    return 'https://assets.ournetcdn.net/ournet/img/icons/' + name + '/' + filename;
}
export function getAppleFavicon(config: AppConfig) {
    return getFavicon(config, 'apple-touch-icon.png');
}
