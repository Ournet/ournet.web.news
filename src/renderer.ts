
import { renderToStaticMarkup } from 'react-dom/server';
import { ReactElement } from 'react';
import { Response } from 'express';
import { PageViewModel } from './view-models/page-view-model';

function render<P extends PageViewModel>(Page: ReactElement<P>) {
    const stream = renderToStaticMarkup(Page);
    return stream;
}

export function renderPage<P extends PageViewModel>(res: Response, node: ReactElement<P>) {
    // const html = `<!DOCTYPE html>${render(node)}`;
    let result = render(node);
    result = '<!DOCTYPE html>' + result;
    // stream.pipe(res);
    res.send(result);
}
