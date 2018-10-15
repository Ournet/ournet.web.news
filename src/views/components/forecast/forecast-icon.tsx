
import * as React from 'react';
import { ForecastHelper } from '@ournet/weather-domain';
import { RootViewModel } from '../../../view-models/root-view-model';

export type ForecastIconViewData = {
    root: RootViewModel
    icon: number
}

export default class ForecastIten extends React.Component<ForecastIconViewData> {
    render() {
        const { icon, root } = this.props;
        const title = ForecastHelper.iconName(icon, root.lang);
        return (
            <i className={`w-icon wi-${icon}`} title={title} />
        )
    }
}
