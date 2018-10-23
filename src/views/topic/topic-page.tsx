
import * as React from 'react';
import CommonLayout from '../common-layout';
import { entipicUrl } from '../../utils';
import * as util from 'util';
import { LocalesNames } from '../../locales-names';
import { Share } from '../components/share';
import QuoteListItem from '../components/news/quote-list-item';
import EventListItem from '../components/news/event-list-item';
import SectionHeader from '../components/section-header';
import { TopicViewModel } from '../../view-models/topic-view-model';
import PageTitle from '../components/page-title';
import NewsItemListItem from '../components/news/item-list-item';
import adCenter from '../components/ad-center';

export default class TopicPage extends React.Component<TopicViewModel> {
    render() {
        const { lang, head, country, __, links, latestEvents, topic, slug, displayName, config, topicEvents, topicNews, aboutQuotes, byQuotes } = this.props;

        const commonName = topic.commonName || topic.name;
        const title = util.format(__(LocalesNames.topic_title), displayName);

        head.elements.push(<link key='topic-rss' rel="alternate" type="application/rss+xml" title={title} href={links.news.rss.stories.topic(slug, { ul: lang })}></link>);



        return (
            <CommonLayout {...this.props}>
                <main>
                    <div className='o-layout'>
                        <div className='o-layout__item u-3/5@tablet c-topic'>
                            <div className='o-media c-topic-h'>
                                <div className='o-media__img'>
                                    <img className='c-topic-h__img' src={entipicUrl(topic.name, 'b', lang, country)} alt={topic.name} />
                                </div>
                                <div className='o-media__body'>
                                    <PageTitle title={title} subTitle={head.description} />
                                    <Share lang={lang} align='right' url={head.canonical} services={config.shareServices}/>
                                    {/* <div className='c-topic_h__about'>{topic.description || topic.about && truncateAt(topic.about, 100)}</div> */}
                                </div>
                            </div>
                            {topicNews.length > 0 ? <div className='c-section'>
                                <hr />
                                {topicNews.map(item => <NewsItemListItem key={item.id} root={this.props} item={item} view='tline' />)}
                                <hr />
                            </div> : null}
                            {topicEvents.length > 0 ?
                                <div className='c-section'>
                                    <SectionHeader name={(topic.abbr || commonName) + ' - ' + __(LocalesNames.latest_events)} h="h4" />
                                    <div className='o-layout'>
                                        {topicEvents.map(item => <div key={item.id} className='o-layout__item u-1/2'><EventListItem root={this.props} item={item} view='zen' /></div>)}
                                    </div>
                                </div>
                                : null
                            }
                            {adCenter()}
                        </div>
                        <div className='o-layout__item u-2/5@tablet'>
                            {byQuotes.length > 0 ? <div>
                                <SectionHeader name={util.format(__(LocalesNames.quotes_by_author), topic.abbr || commonName)} h='h4' />
                                {byQuotes.map(item => <QuoteListItem key={item.id} root={this.props} item={item} view='card' />)}
                            </div> : null}
                            {/* {adAside()} */}
                            {aboutQuotes.length > 0 ? <div>
                                <SectionHeader name={util.format(__(LocalesNames.quotes_about), topic.abbr || commonName)} h='h4' />
                                {aboutQuotes.map(item => <QuoteListItem key={item.id} root={this.props} item={item} view='card' />)}
                            </div> : null}
                        </div>
                    </div>

                    <div className='c-section'>
                        <SectionHeader name={__(LocalesNames.latest_events)} link={links.news.home({ ul: lang })} />
                        <div className='o-layout'>
                            {latestEvents.map(item => <div key={item.id} className='o-layout__item u-1/2@tablet u-1/4@desktop'><EventListItem root={this.props} item={item} view='zen' /></div>)}
                        </div>
                    </div>

                </main>
            </CommonLayout >
        )
    }
}
