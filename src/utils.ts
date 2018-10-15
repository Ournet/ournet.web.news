
const ellipsize = require('ellipsize');

export function truncateAt(text: string, maxLength: number): string {
    return ellipsize(text, maxLength, { truncate: false });
}

export const LOCALE_ROUTE_PREFIX = '(ru)';

export function encodeHTML(str: string) {
    return str.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/'/g, '&#39;')
        .replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

export function unixTime(date?: Date) {
    date = date || new Date();

    return Math.floor(date.getTime() / 1000);
}

export function startWithUpperCase(text: string) {
    if (text && text.length) {
        return text[0].toUpperCase() + text.substr(1);
    }
    return text;
}

export function isNullOrEmpty(val?: string) {
    return [null, undefined, ''].includes(val);
}
