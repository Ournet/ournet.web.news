import * as React from 'react';
import { NewsViewModel } from '../view-models/news-view-model';
import RootLayout from './root-layout';
import TrendingTopicsMenu from './components/news/trending-topics-menu';

export default class CommonLayout extends React.Component<NewsViewModel> {
    render() {
        const { lang, links, trendingTopics } = this.props;
        return (
            <RootLayout {...this.props}>
                <TrendingTopicsMenu lang={lang} links={links} topics={trendingTopics} />
                {this.props.children}
            </RootLayout>
        )
    }
}
