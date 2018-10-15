
import * as React from 'react';

export type PageTitleViewModel = {
    title: string
    subTitle?: React.ReactNode
    h?: 1 | 2 | 3 | 4
}

export default class PageTitle extends React.Component<PageTitleViewModel> {
    render() {
        const { title, subTitle } = this.props;
        return (
            <div className='c-page-title'>
                <h1>{title}</h1>
                {subTitle && <h2>{subTitle}</h2>}
            </div>
        )
    }
}
