
import { renderToStaticMarkup } from 'react-dom/server';
import { ReactElement } from 'react';
import { Response } from 'express';
import { PageViewModel } from './view-models/page-view-model';

function render<P extends PageViewModel>(Page: ReactElement<P>) {
    const stream = renderToStaticMarkup(Page);
    return stream;
}

export function renderPage<P extends PageViewModel>(res: Response, node: ReactElement<P>, redirect?: RedirectInfo) {
    if (redirect) {
        return res.redirect(redirect.code || 300, redirect.url);
    }
    // const html = `<!DOCTYPE html>${render(node)}`;
    let result = render(node);
    result = '<!DOCTYPE html>' + result;
    // stream.pipe(res);
    res.send(result);
}

export type RedirectInfo = {
    code?: number
    url: string
}
