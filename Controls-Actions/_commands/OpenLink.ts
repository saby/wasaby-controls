import { parseLinks } from 'Controls/markup';

const PROTOCOL_REG_EXP = /((?:[A-Za-z]{3,9}):((\/\/)|(\\\\)))|((?:mailto|tel):)/gi;

interface IOpenLinkOptions {
    link: string;
    blankTarget: boolean;
}

/**
 * Действие перехода по ссылке
 *
 * @public
 */
class OpenLink {
    execute({ link, blankTarget = true }: IOpenLinkOptions): void {
        if (this._hasLink(link)) {
            const resultTarget = blankTarget ? '_blank' : '_self';
            window.open(this._fixProtocolIfNeed(link), resultTarget);
        }
    }

    protected _hasLink(value: string): boolean {
        const [parseResult, hasLink] = parseLinks(value, false, false);
        if (!hasLink) {
            return !!/^\/[^\s@]*$/.exec(value);
        }
        const linkObject = parseResult[parseResult.length - 1];
        const isFullTextIsLink = linkObject?.text === value;

        return hasLink && isFullTextIsLink;
    }

    protected _fixProtocolIfNeed(link: string): string {
        const LINK_ATTR_INDEX = 1;
        const [result, hasLink] = parseLinks(link, false, false);
        const href =
            typeof result !== 'string' && result[LINK_ATTR_INDEX].href
                ? result[LINK_ATTR_INDEX].href
                : link;
        // Если не указан протокол, но мы поняли что это ссылка, то указываем протокол, в остальных случаях ссылку не трогаем
        if (href.search(PROTOCOL_REG_EXP) === -1 && hasLink) {
            return `https://${href}`;
        }
        return href;
    }
}

export default OpenLink;
