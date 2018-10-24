
import * as React from 'react';
import { boomify } from 'boom';
import { LocalesNames } from '../locales-names';
import CommonLayout from './common-layout';
import EventListItem from './components/news/event-list-item';
import { ErrorViewModel } from '../view-models/error-view-model';
import env from '../env';

export default class ErrorPage extends React.Component<ErrorViewModel> {
    render() {
        const { __, error, latestEvents, head } = this.props;

        const boomError = boomify(error);
        const errorCode = boomError.isServer ? 500 : 404;
        const title = boomError.isServer ? __(LocalesNames.error_500_info) : __(LocalesNames.error_404_info);

        head.title = `${__(LocalesNames.error)}: ${errorCode}`;

        return (
            <CommonLayout {...this.props}>
                <main>
                    <div className='c-error-h'>
                        <h1>{__(LocalesNames.error)}: <span>{errorCode}</span></h1>
                        <h4>{title}</h4>
                        {!env.isProduction && <p>{JSON.stringify(boomError.output)}</p>}
                    </div>

                    <div className='c-section'>
                        <div className='o-layout'>
                            {latestEvents.map(item => <div key={item.id} className='o-layout__item u-1/2@mobile u-1/4@tablet'><EventListItem root={this.props} item={item} view='card' /></div>)}
                        </div>
                    </div>
                </main>
            </CommonLayout >
        )
    }
}
