
import * as React from 'react';
import Logo from './logo';
import { NewsViewModel } from '../../../view-models/news-view-model';
import CapitalForecast from './capital-forecast';
import { LocalesNames } from '../../../locales-names';

export default class HeaderComponent extends React.Component<NewsViewModel> {
    render() {
        const { capital, capitalForecast, __, links, lang, head } = this.props;
        const placeForecast = capital && capitalForecast
            ? <CapitalForecast root={this.props} place={capital} forecast={capitalForecast} />
            : null;


        const menuitems = [
            {
                name: __(LocalesNames.news),
                link: links.news.home({ ul: lang }),
                className: '',
            }, {
                name: __(LocalesNames.important),
                link: links.news.important({ ul: lang }),
            }, {
                name: __(LocalesNames.quotes),
                link: links.news.quotes({ ul: lang }),
            },
        ];

        if (head.canonical) {
            for (let i = 0; i < menuitems.length; i++) {
                if (head.canonical.endsWith(menuitems[i].link)) {
                    menuitems[i].className = 'c-menu--selected';
                    break;
                }
            }
        }

        return (
            <header className='c-header o-layout o-layout--small'>
                <div className='o-layout__item u-2/6 u-1/6@tablet'>
                    <Logo {...this.props} />
                </div>
                <div className='o-layout__item u-4/6 u-3/6@tablet'>
                    <ul className='c-menu'>
                        {menuitems.map((item, i) => <li key={i}><a className={item.className} href={item.link}>{item.name}</a></li>)}
                    </ul>
                </div>
                <div className='o-layout__item u-2/6@tablet u-hide-mobile u-tr'>
                    {placeForecast}
                </div>
            </header>
        )
    }
}
