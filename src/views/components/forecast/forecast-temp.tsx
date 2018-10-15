
import * as React from 'react';

export type ForecastTempViewData = {
    temperature: number
}

export default class ForecastTemp extends React.Component<ForecastTempViewData> {
    render() {
        const { temperature } = this.props;
        return (
            <span className='c-fc-temp'>{Math.round(temperature)}°</span>
        )
    }
}
