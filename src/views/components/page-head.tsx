import * as React from 'react';
import { PageViewModel } from '../../view-models/page-view-model';
import env from '../../env';

export default class PageHead extends React.Component<PageViewModel> {
    render() {
        const { config, head, lang, country, project } = this.props;

        let shortDomainName = config.domain.split('.')[0]
        shortDomainName = ['click', 'zborg', 'diez'].indexOf(shortDomainName) > -1 ? shortDomainName : 'ournet';

        const elements: JSX.Element[] = []

        if (env.isProduction) {
            elements.push(<link key='1' type="text/css" rel="stylesheet" href={`//assets.ournetcdn.net/ournet/css/${project}/main-${config.assets.css.main}.css`} />);
        } else {
            elements.push(<link key='2' type="text/css" rel="stylesheet" href={`http://localhost:8080/css/${project}/main.css`} />)
        }

        head.elements = elements.concat(head.elements);

        return (
            <head>
                <meta charSet="utf-8" />
                <meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1,minimal-ui" />
                <title>{head.title}</title>
                {head.description && <meta name="description" content={head.description} />}
                {head.canonical && <link rel="canonical" href={head.canonical} />}
                <link rel='shortcut icon' href={`//assets.ournetcdn.net/ournet/img/icons/${shortDomainName}/favicon.ico`} type='image/x-icon' />
                <link rel='apple-touch-icon' href={`//assets.ournetcdn.net/ournet/img/icons/${shortDomainName}/apple-touch-icon.png`} />
                {head.elements}
                <link rel="dns-prefetch" href="//assets.ournetcdn.net" />
                <link rel="dns-prefetch" href="//ajax.googleapis.com" />
                <link rel="dns-prefetch" href="//tpc.googlesyndication.com" />
                <link rel="dns-prefetch" href="//pagead2.googlesyndication.com" />
                <script dangerouslySetInnerHTML={{ __html: `window.CONSTANTS={lang:"${lang}",country:"${country}"};` }}></script>
            </head>
        )
    }
}
