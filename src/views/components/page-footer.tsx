
import * as React from 'react';
import { RootViewModel } from '../../view-models/root-view-model';
import { LocalesNames, LocalesHelper } from '../../locales-names';
import { getSchema, getHost } from 'ournet.links';
import { Dictionary } from '@ournet/domain';
// import AccentLine from './accent-line';
const countryNames = require('../../../country-names.json') as Dictionary<Dictionary<string>>;

export default class PageFooter extends React.Component<RootViewModel> {
    render() {
        const { config, __, links, lang, country, version, project } = this.props;
        return (
            <footer className='c-footer'>
                {/* <AccentLine type='tiny' /> */}
                <div className='o-wrapper'>
                    <div className='o-layout'>
                        <div className='o-layout__item u-1/3@tablet o-footer-info'>
                            <h4>{__(LocalesNames.info)}</h4>
                            <div>{__(LocalesNames.contact)} <a href={'mailto:' + config.email}>{config.email}</a></div>
                            <div>Version: {version}</div>
                            {/* <div>{__(LocalesNames.weather_cright)}</div> */}
                        </div>
                        <div className='o-layout__item u-1/3@tablet o-footer-sites'>
                            <h4>{__(LocalesNames.international)}</h4>
                            {config.internationalIds.map(code => <div key={code}><a href={getSchema(project, code) + '//' + getHost(project, code) + links.horoscope.home({ ul: lang })}>{countryNames[code][lang]}</a></div>)}
                        </div>
                        <div className='o-layout__item u-1/3@tablet o-footer-useful'>
                            <h4>{__(LocalesNames.useful)}</h4>
                            {config.projects.map(item => <div key={item}><a href={getSchema(item, country) + '//' + getHost(item, country)}>{LocalesHelper.getProjectName(__, item)}</a></div>)}
                        </div>
                    </div>
                </div>
            </footer>
        );
    }
}
