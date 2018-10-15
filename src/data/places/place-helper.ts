import { Place } from "@ournet/api-client";
import { PlaceHelper as DomainPlaceHelpers } from '@ournet/places-domain';
import { startWithUpperCase } from "../../utils";
const standard = require('standard-text');

export class PlaceHelper {
    static getName(place: Place, lang: string) {
        const name = place.names ?
            DomainPlaceHelpers.parseNames(place.names || '').find(item => item.lang === lang)
            : null;
        if (name && name.name) {
            return standard(name.name, lang);
        }
        return standard(place.name, lang);
    }
    static shortAdm1Name(place: Place, lang: string) {
        let name = PlaceHelper.getName(place, lang);
        if (!name) {
            return name;
        }
        name = name.trim();

        switch (place.countryCode) {
            case 'al':
                switch (place.asciiname) {
                    case 'Qarku i Beratit':
                        return 'Berat';
                    case 'Qarku i Tiranes':
                        return 'Tirana';
                    case 'Qarku i Dibres':
                        return 'Dibër';
                    case 'Qarku i Elbasanit':
                        return 'Elbasan';
                    case 'Qarku i Gjirokastres':
                        return 'Gjirokastër';
                    case 'Qarku i Korces':
                        return 'Korçë';
                    case 'Qarku i Kukesit':
                        return 'Kukës';
                    case 'Qarku i Durresit':
                        return 'Durrës';
                    case 'Qarku i Fierit':
                        return 'Fier';
                    case 'Qarku i Lezhes':
                        return 'Lezhë';
                    case 'Qarku i Shkodres':
                        return 'Shkodër';
                    case 'Qarku i Vlores':
                        return 'Vlorë';
                }
                break;
            case 'lv':
                return name.replace(' Rajons', '').replace(' Novads', '');
            case 'lt':
                return name.replace(' Apskritis', '');
            case 'ro':
                return name.replace('Judeţul ', '').replace('Municipiul ', '').replace('Judetul ', '').replace('Județul ', '');
            case 'md':
                return name.replace('Judeţul ', '').replace('Municipiul ', '').replace('Judetul ', '').replace('Raionul ', '').replace('Județul ', '')
                    .replace('Unitatea Teritorială din Stînga Nistrului', 'Transnistria')
                    .replace('Municipiu ', '').replace('Unitate Teritorială Autonomă Găgăuzia', 'Gagauzia')
                    .replace('Unitate Teritoriala Autonoma Gagauzia', 'Găgăuzia');
            case 'ru':
                return name.replace('Республика ', '');
            case 'in':
                return name.replace('National Capital Territory of ', '').replace('Union Territory of ', '').replace('State of ', '');
            case 'hu':
                return name.replace(' főváros', '').replace(' fovaros', '').replace(' megye', '');
            case 'bg':
                return name.replace('Област ', '');
            case 'mx':
                return name.replace('Estado de ', '');
            case 'pl':
                return startWithUpperCase(name.replace('Województwo ', ''));
        }

        return name;
    }
    static isBigCity(place: Place, minPopulation: number) {
        return place.featureClass === 'P' && (place.featureCode === 'PPLC' || place.featureCode === 'PPLA' || (minPopulation && (place.population && place.population >= minPopulation)));
    }
    static isMainCity(place: Place) {
        return place.featureCode === 'PPLC' || place.featureCode === 'PPLA';
    }
    static isCapital(place: Place) {
        return place.featureCode === 'PPLC';
    }
    static isAdm(place: Place) {
        return place.featureClass === 'A';
    }
    static isPopulatedPlace(place: Place) {
        return place.featureClass === 'P';
    }
    static inCountryName(countryName: string, lang: string) {
        switch (lang) {
            case 'ru':
                if (countryName[countryName.length - 1] === 'я') {
                    return countryName.substring(0, countryName.length - 1) + 'и';
                }
                if (countryName === 'Молдова') {
                    return 'Молдове';
                }
                if (countryName === 'Украина') {
                    return 'Украине';
                }
                if (countryName === 'Беларусь') {
                    return 'Беларуси';
                }
                break;
            case 'uk':
                if (countryName === 'Україна') {
                    return 'Україні';
                }
                break;
            case 'cs':
                return 'ČR';
            case 'pl':
                if (countryName === 'Polska') {
                    return 'Polsce';
                }
                break;
        }
        return countryName;
    }

    static inPlaceName(place: Place, lang: string) {
        const name = PlaceHelper.getName(place, lang);
        switch (lang) {
            case 'ru':
                return rusEndName(name);
        }
        return name;
    }
}


const RUS_END_REPLACE: { [index: string]: string } = {
    'ль': 'ле'
}

function rusEndName(name: string) {
    for (var key in RUS_END_REPLACE) {
        if (name.endsWith(key)) {
            return name.substr(0, name.length - key.length) + RUS_END_REPLACE[key];
        }
    }

    switch (name[name.length - 1]) {
        case 'р':
        case 'г':
        case 'д':
        case 'к':
        case 'т':
        case 'в':
            return name + 'е';
        case 'ь':
            return name.substr(0, name.length - 1) + 'и';
        case 'а':
            return name.substr(0, name.length - 1) + 'е';
        case 'б':
            //case 'в':
            return name;
    }
    return name;
}
