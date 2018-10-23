
import * as React from 'react';
import CommonLayout from '../common-layout';
import { LocalesNames } from '../../locales-names';
import EventListItem from '../components/news/event-list-item';
import QuoteListItem from '../components/news/quote-list-item';
import PageTitle from '../components/page-title';
import adCenter from '../components/ad-center';
import GroupHeader from '../components/group-header';
import { ImportantViewModel } from '../../view-models/important-view-model';
import { Share } from '../components/share';

export default class ImportantPage extends React.Component<ImportantViewModel> {
    render() {
        const { lang, head, __, links, importantEvents, latestQuotes, title, subTitle, config } = this.props;

        head.elements.push(<link key='important-rss' rel="alternate" type="application/rss+xml" title={__(LocalesNames.important_news)} href={links.news.rss.stories.important({ ul: lang })}></link>);

        const list1 = importantEvents.slice(0, importantEvents.length / 2);
        const list2 = importantEvents.slice(importantEvents.length / 2);

        return (
            <CommonLayout {...this.props}>
                <main>
                    <Share lang={lang} url={head.canonical} align='right' services={config.shareServices} />
                    <PageTitle title={title || head.title} subTitle={subTitle || head.description} />

                    <div className='o-layout'>
                        {list1.map(item => <div key={item.id} className='o-layout__item u-1/3@tablet'><EventListItem root={this.props} item={item} view='zen' imageSize='large' /></div>)}
                    </div>
                    {adCenter()}
                    <div className='o-layout'>
                        {list2.map(item => <div key={item.id} className='o-layout__item u-1/3@tablet'><EventListItem root={this.props} item={item} view='zen' imageSize='large' /></div>)}
                    </div>

                    <div className='c-group'>
                        <GroupHeader name={__(LocalesNames.latest_quotes)} link={links.news.quotes({ ul: lang })} type='important' />
                        <div className='o-layout'>
                            {latestQuotes.map(item => <div key={item.id} className='o-layout__item u-1/3@tablet'><QuoteListItem root={this.props} item={item} view='card' /></div>)}
                        </div>
                    </div>
                </main>
            </CommonLayout >
        )
    }
}
