
import * as React from 'react';
import { RootViewModel } from '../../../view-models/root-view-model';
import { getHost } from 'ournet.links';
import { OurnetProjects } from '../../../data/common';

export default class HeaderLogoComponent extends React.Component<RootViewModel> {
    render() {
        const { config, links, lang, country } = this.props;

        return (
            <div className='c-logo'>
                <a className='c-logo__img' href={'http://' + getHost(OurnetProjects.portal, country) + links.portal.home({ ul: lang })} title={config.name} />
            </div>
        )
    }
}
