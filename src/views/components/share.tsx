
import * as React from 'react';

export interface ShareProps {
    services: string[]
    align?: string
    url?: string
    lang: string
}

export class Share extends React.Component<ShareProps> {
    render() {
        const { services, align, url, lang } = this.props;
        return (
            <div className={'o-share' + (align ? ' o-share--right' : '')}>
                <script async={true} src="//yastatic.net/share2/share.js"></script>
                <div className="ya-share2" data-services={services.join(',')} data-counter="" data-lang={lang} data-url={url}></div>
            </div>
        )
    }
}
