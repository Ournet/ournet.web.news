
import * as React from 'react';
import { IndexViewModel } from '../../view-models/index-view-model';
import CommonLayout from '../common-layout';
import { LocalesNames } from '../../locales-names';

export default class IndexPage extends React.Component<IndexViewModel> {
    render() {
        const { lang, head, __, links } = this.props;

        head.elements.push(<link key='events-rss' rel="alternate" type="application/rss+xml" title={__(LocalesNames.events)} href={links.news.rss.stories({ ul: lang })}></link>);

        return (
            <CommonLayout {...this.props}>
                <main>

                </main>
            </CommonLayout>
        )
    }
}
