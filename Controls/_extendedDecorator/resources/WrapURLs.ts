/**
 * @kaizen_zone 10186a4a-7303-4e81-9d11-c395e91cec99
 */

interface IMap {
    result: number;
    localFileInQuotes: number;
    openDelimiter: number;
    linkHref: number;
    schemeHref: number;
    emailAddress: number;
    localFile: number;
    plainValue: number;
    closeDelimiter: number;
}

interface ILink {
    type: 'link';
    href: string;
    scheme: string;
}

interface IEmail {
    type: 'email';
    address: string;
}

interface IPlain {
    type: 'plain';
    value: string;
}

export type Path = ILink | IEmail | IPlain;

export function parseText(value: string): Path[] {
    let iteration: number = 1;
    const maxIterations = 10000;
    const parsedTexts: Path[] = [];
    // Бывают ситуации, когда не удается распарсить ссылку, если перед ней стоит знак препинания,
    // Поэтому отделяем возможную ссылку пробелом
    // https://online.sbis.ru/opendoc.html?guid=2229ac37-353c-4601-8056-d22c9ee0f919
    const text = value.replace(/([\?.,])http/g, '$1 http');
    let exec: RegExpExecArray = parseRegExp.exec(text);

    while (exec) {
        if (text.length === parseRegExp.lastIndex && !exec[mapExec.result]) {
            parseRegExp.lastIndex = 0;
            break;
        }

        pushPlain(parsedTexts, exec[mapExec.openDelimiter]);
        pushLink(parsedTexts, exec[mapExec.linkHref], exec[mapExec.schemeHref]);
        pushLink(parsedTexts, exec[mapExec.localFileInQuotes] || exec[mapExec.localFile], '');
        pushEmail(parsedTexts, exec[mapExec.emailAddress]);
        pushPlain(parsedTexts, exec[mapExec.plainValue]);
        pushPlain(parsedTexts, exec[mapExec.closeDelimiter]);

        /*
         * Protection against looping.
         */
        if (iteration >= maxIterations) {
            break;
        }
        iteration++;
        exec = parseRegExp.exec(text);
    }

    return parsedTexts;
}

/**
 * $1 - Opening delimiter.
 * $2 - Web link.
 * $3 - Scheme to access the web resource.
 * $4 - Email address.
 * $5 - Plain text.
 * $6 - Closing delimiter.
 * @private
 */

function pushLink(original: Path[], href: string, scheme: string): Path[] {
    if (!(href || scheme)) {
        return original;
    }

    original.push({
        href,
        scheme,
        type: 'link',
    });

    return original;
}

function pushEmail(original: Path[], address: string): Path[] {
    if (!address) {
        return original;
    }

    original.push({
        address,
        type: 'email',
    });

    return original;
}
function pushPlain(original: Path[], value: string): Path[] {
    if (!value) {
        return original;
    }

    const type = 'plain';
    const last: Path = original[original.length - 1];

    if (last && last.type === type) {
        last.value += value;
    } else {
        original.push({ value, type });
    }

    return original;
}

const parseRegExp: RegExp =
    /((["'])(\\)(?:|(?:.*?)(?:[^\\]|[^\\]?(?:\\{2})+))\2)|([({\[⟨<«„‘'"]?)(?:(((?:https?|ftp|file|Notes|notes):\/\/|www\.)\S+?)|(\S+@\S+(?:\.\S{2,6}?))|(\\\\\S+?)|(\S*?))([)}\]⟩>»”’'".,:]?(?:\s|$))/g;

const mapExec: IMap = {
    result: 0,
    localFileInQuotes: 1,
    openDelimiter: 4,
    linkHref: 5,
    schemeHref: 6,
    emailAddress: 7,
    localFile: 8,
    plainValue: 9,
    closeDelimiter: 10,
};
