
import * as React from 'react';
import { RootViewModel } from '../../../view-models/root-view-model';
import { Place, HourlyForecastDataPoint } from '@ournet/api-client';
import ForecastTemp from '../forecast/forecast-temp';
import ForecastIcon from '../forecast/forecast-icon';
import { PlaceHelper } from '../../../data/places/place-helper';
import { getSchema, getHost } from 'ournet.links';
import { OurnetProjects } from '../../../data/common';

export interface CapitalForecastComponentProps {
    root: RootViewModel
    place: Place
    forecast: HourlyForecastDataPoint
}

export default class CapitalForecastComponent extends React.Component<CapitalForecastComponentProps> {
    render() {
        const { place, forecast, root } = this.props;
        const { links, lang, country } = root;
        const name = PlaceHelper.getName(place, lang);
        return (
            <div className='c-cap'>
                <ForecastIcon root={root} icon={forecast.icon} />
                <span className='c-cap__name'>
                    <a href={getSchema(OurnetProjects.weather, country) + '//' + getHost(OurnetProjects.weather, country) + links.weather.place(place.id, { ul: lang })} title={name}>{name}</a>
                    <ForecastTemp temperature={forecast.temperature} />
                </span>
            </div>
        )
    }
}
