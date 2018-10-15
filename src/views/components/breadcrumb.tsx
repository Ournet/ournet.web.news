
import * as React from 'react';

export type BreadcrumbViewData = {
    items: BreadcrumbItem[]
}

export type BreadcrumbItem = {
    url: string
    text: string
    title?: string
}

export default class BreadcrumbComponent extends React.Component<BreadcrumbViewData> {
    render() {
        const items: any[] = this.props.items.map((link, index) => {
            if (index === this.props.items.length - 1) {
                return <a key={index} href={link.url} title={link.title}>{link.text}</a>;
            } else {
                return [<a key={index} href={link.url} title={link.title}>{link.text}</a>, ' › ']
            }
        });
        return (
            <nav aria-label="breadcrumb" className='c-breadcrumb'>
                {items}
            </nav>
        )
    }
}
