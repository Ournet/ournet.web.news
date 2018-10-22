
import * as React from 'react';
import CommonLayout from '../common-layout';
import { LocalesNames } from '../../locales-names';
import EventListItem from '../components/news/event-list-item';
import QuoteListItem from '../components/news/quote-list-item';
import { QuotesViewModel } from '../../view-models/quotes-view-model';
import PageTitle from '../components/page-title';
import adCenter from '../components/ad-center';
import GroupHeader from '../components/group-header';
import { Share } from '../components/share';

export default class QuotesPage extends React.Component<QuotesViewModel> {
    render() {
        const { lang, head, __, links, latestEvents, latestQuotes, config, title, subTitle } = this.props;

        const list1 = latestQuotes.slice(0, latestQuotes.length / 2);
        const list2 = latestQuotes.slice(latestQuotes.length / 2);

        return (
            <CommonLayout {...this.props}>
                <main>
                    <Share lang={lang} url={head.canonical} align='right' services={config.shareServices} />
                    <PageTitle title={title || head.title} subTitle={subTitle || head.description} />

                    <div className='o-layout'>
                        {list1.map(item => <div key={item.id} className='o-layout__item u-1/3@tablet'><QuoteListItem root={this.props} item={item} view='card' /></div>)}
                    </div>
                    {adCenter()}
                    <div className='o-layout'>
                        {list2.map(item => <div key={item.id} className='o-layout__item u-1/3@tablet'><QuoteListItem root={this.props} item={item} view='card' /></div>)}
                    </div>

                    <div className='c-group'>
                        <GroupHeader name={__(LocalesNames.latest_events)} link={links.news.home({ ul: lang })} type='new' />
                        <div className='o-layout'>
                            {latestEvents.map(item => <div key={item.id} className='o-layout__item u-1/2 u-1/4@tablet'><EventListItem root={this.props} item={item} view='card' /></div>)}
                        </div>
                    </div>
                </main>
            </CommonLayout >
        )
    }
}
