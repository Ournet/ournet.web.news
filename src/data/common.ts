import { GraphQLQueryItemInput } from "@ournet/api-client";

export enum OurnetProjects {
    weather = 'weather',
    news = 'news',
    portal = 'portal',
    horoscope = 'horoscope',
    exchange = 'exchange',
}

export const PlaceNoAdmin1Fields = 'id name names longitude latitude timezone countryCode';

export const PlaceNoAdmin1QueryData: GraphQLQueryItemInput = {
    fields: PlaceNoAdmin1Fields
}
