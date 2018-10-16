
import * as React from 'react';
import { IndexViewModel } from '../../view-models/index-view-model';
import CommonLayout from '../common-layout';
import { LocalesNames } from '../../locales-names';
import EventListItem from '../components/news/event-list-item';
import QuoteListItem from '../components/news/quote-list-item';
import GroupHeader from '../components/group-header';

export default class IndexPage extends React.Component<IndexViewModel> {
    render() {
        const { lang, head, __, links, latestEvents, latestQuotes, currentDate } = this.props;

        head.elements.push(<link key='events-rss' rel="alternate" type="application/rss+xml" title={__(LocalesNames.events)} href={links.news.rss.stories({ ul: lang })}></link>);

        const recentDate = currentDate.clone().add(-12, 'hours').toISOString();

        let recentEvents = latestEvents.filter(item => item.createdAt > recentDate);

        if (!recentEvents.length) {
            recentEvents = latestEvents;
        }

        const mainEvent = recentEvents.sort((a, b) => b.countNews - a.countNews)[0];
        const restEvents = latestEvents.filter(item => item.id !== mainEvent.id);

        return (
            <CommonLayout {...this.props}>
                <main>
                    <div className='o-layout'>
                        <div className='o-layout__item u-2/5@tablet'>
                            <EventListItem root={this.props} item={mainEvent} view='main' />
                        </div>
                        <div className='o-layout__item u-3/5@tablet'>
                            <div className='o-layout'>
                                {restEvents.slice(0, 4).map(item => <div key={item.id} className='o-layout__item u-1/2'><EventListItem root={this.props} item={item} view='card' /></div>)}
                            </div>
                        </div>
                    </div>
                    <div className='c-group'>
                        <GroupHeader name={__(LocalesNames.latest_quotes)} link={links.news.quotes({ ul: lang })} type='important' />
                        <div className='o-layout'>
                            {latestQuotes.map(item => <div key={item.id} className='o-layout__item u-1/3@tablet'><QuoteListItem root={this.props} item={item} view='card' /></div>)}
                        </div>
                    </div>
                    <div className='o-layout'>
                        {restEvents.slice(4).map(item => <div key={item.id} className='o-layout__item u-1/2 u-1/4@tablet'><EventListItem root={this.props} item={item} view='card' /></div>)}
                    </div>
                </main>
            </CommonLayout >
        )
    }
}
