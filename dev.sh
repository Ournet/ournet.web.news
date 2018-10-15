#!/bin/bash

yarn remove @ournet/domain
yarn remove @ournet/api-client
yarn remove @ournet/weather-domain
yarn remove @ournet/places-domain
yarn remove @ournet/images-domain
yarn remove @ournet/horoscopes-domain
yarn remove @ournet/news-domain
yarn remove ournet.links

yarn link @ournet/domain
yarn link @ournet/api-client
yarn link @ournet/weather-domain
yarn link @ournet/places-domain
yarn link @ournet/images-domain
yarn link @ournet/horoscopes-domain
yarn link @ournet/news-domain
yarn link ournet.links

yarn test
