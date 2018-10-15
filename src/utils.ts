
const ellipsize = require('ellipsize');
const entipicUrlFn = require('entipic.url');

export function entipicUrl(name: string, size?: 'a' | 'b' | 'c' | 'd' | 'e' | 'f' | string, lang?: string, country?: string): string {
    return entipicUrlFn(name, size, lang, country)
}

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
