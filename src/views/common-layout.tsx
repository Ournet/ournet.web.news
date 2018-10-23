import * as React from 'react';
import { NewsViewModel } from '../view-models/news-view-model';
import RootLayout from './root-layout';
import TrendingTopicsMenu from './components/news/trending-topics-menu';
import env from '../env';

export default class CommonLayout extends React.Component<NewsViewModel> {
    render() {
        const { lang, links, trendingTopics, project, config } = this.props;
        return (
            <RootLayout {...this.props}>
                <TrendingTopicsMenu lang={lang} links={links} topics={trendingTopics} />
                {this.props.children}
                {env.isProduction ?
                    <script key='3' async={true} src={`//assets.ournetcdn.net/ournet/js/${project}/main-${config.assets.js.main}.js`} />
                    : <script key='4' async={true} src={`http://localhost:8080/js/${project}/main.js`} />
                }
            </RootLayout>
        )
    }
}
