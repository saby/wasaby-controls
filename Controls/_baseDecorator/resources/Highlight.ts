/**
 * @kaizen_zone 10186a4a-7303-4e81-9d11-c395e91cec99
 */
import { HighlightMode, IHighlightOptions } from '../Highlight';
import { Logger } from 'UI/Utils';
import { addWordCheck, escapeSpecialChars } from '../inputUtils/RegExp';

type SearchBy = 'and' | 'or';
export type Element = IHighlight | IPlain;
interface IHighlight {
    type: 'highlight';
    value: string;
}

interface IPlain {
    type: 'plain';
    value: string;
}

interface ISearchResult {
    index: number;
    value: string;
}

const WORD_SEPARATOR: RegExp = /[,.\s+]/g;
const MINIMUM_WORD_LENGTH: number = 2;

export function prepareParsedText(data: IHighlightOptions): Element[] {
    const {value, highlightMode} = data;
    if (
        value === undefined ||
        value === null
    ) {
        return [];
    }
    const newValue =
        typeof value === 'string' ? value : String(value);
    const highlightedValue = Array.isArray(data.highlightedValue)
        ? data.highlightedValue
        : [data.highlightedValue];
    if (
        highlightedValue.length &&
        highlightedValue.filter(isNotEmpty).length !== 0
    ) {
        return parseText(
            newValue,
            highlightedValue,
            highlightMode || 'substring'
        );
    } else {
        return [
            {
                type: 'plain',
                value: newValue,
            },
        ];
    }
}

function parseText(
    value: string,
    highlights: string[],
    highlightMode: HighlightMode
): Element[] {
    /**
     * Подсвечиваемый текст нужно ограничить, потому что в дальнейшем он будет преобразован в регулярное выражение, которое
     * имеет ограничение длины. При превышении длины регулярное выражение будет считаться невалидным, и с ним невозможно будет работать.
     * Возьмем максимум 10000 символов. Этого точно должно хватить для покрытия всех адекватных сценариев.
     */
    const maxLength: number = 10000;
    const escapedHighlights = [];
    highlights.forEach((highlight) => {
        const limitHighlight: string =
            highlight.length > maxLength
                ? highlight.substring(0, maxLength)
                : highlight;
        escapedHighlights.push(escapeSpecialChars(limitHighlight));
    });
    const searchResultByAnd: Element[] = searchBy(
        value,
        escapedHighlights,
        highlightMode,
        'and'
    );

    if (searchResultByAnd.length) {
        return searchResultByAnd;
    }
    // Так как мы экранируем точку, то при or точка является разделителем, из-за чего получаем регулярку text\|text.
    // Хотя ожидаем text|text, поэтому отменяем экранирование для точки.
    const escapedHighlightsReplaced = escapedHighlights.map(
        (escapedHighlight) => {
            return escapedHighlight.replace(/\\./g, '.');
        }
    );
    return searchBy(value, escapedHighlightsReplaced, highlightMode, 'or');
}

function searchBy(
    value: string,
    highlights: string[],
    highlightMode: HighlightMode,
    by: SearchBy
): Element[] {
    let words: string[] = [];
    switch (by) {
        case 'and':
            words = highlights;
            break;
        case 'or':
            highlights.forEach((highlight) => {
                words.push(...highlight.split(WORD_SEPARATOR));
            });

            if (highlightMode === 'word') {
                words = words.filter(isWord);
            }
            break;
        default:
            Logger.error(`"${by}" search is not supported.`);
            words = highlights;
            break;
    }

    words = words.filter(isNotEmpty);

    if (words.length === 0) {
        return [
            {
                value,
                type: 'plain',
            },
        ];
    }

    const regexp: RegExp = calculateRegExp(words, highlightMode);
    const highlightSearchResult: ISearchResult[] = search(value, regexp);

    if (highlightSearchResult.length === 0) {
        if (by === 'or') {
            return [
                {
                    value,
                    type: 'plain',
                },
            ];
        }

        return [];
    }

    return split(value, highlightSearchResult);
}

function calculateRegExp(
    valueArr: string[],
    highlightMode: HighlightMode
): RegExp {
    const flags: string = 'gi';
    const value: string = valueArr.join('|').replace(/([её])/gi, '[её]');

    switch (highlightMode) {
        case 'word':
            return addWordCheck(value, flags);
        case 'substring':
            return new RegExp(`${value}`, flags);
        default:
            Logger.error(`Unsupported highlight mode: ${highlightMode}.`);
            return new RegExp(`${value}`, flags);
    }
}

function isNotEmpty(value: string): boolean {
    return value !== '';
}

function isWord(value: string): boolean {
    return value.length >= MINIMUM_WORD_LENGTH;
}

function search(value: string, regexp: RegExp): ISearchResult[] {
    let iterations: number = 1e4;
    const searchResult: ISearchResult[] = [];
    let found: RegExpExecArray | null = regexp.exec(value);

    while (found && iterations >= 1) {
        searchResult.push({
            value: found[0],
            index: found.index,
        });

        found = regexp.exec(value);
        iterations--;
    }

    return searchResult;
}

function split(value: string, found: ISearchResult[]): Element[] {
    const result: Element[] = [];
    const foundLength: number = found.length;

    if (foundLength === 0) {
        result.push({
            type: 'plain',
            value,
        });

        return result;
    }

    let index: number = 0;
    for (let i = 0; i < foundLength; i++) {
        const highlight = found[i];
        const plainValue: string = value.substring(index, highlight.index);

        if (plainValue) {
            result.push({
                type: 'plain',
                value: plainValue,
            });
        }

        result.push({
            type: 'highlight',
            value: highlight.value,
        });

        index = highlight.index + highlight.value.length;
    }

    if (index !== value.length) {
        result.push({
            type: 'plain',
            value: value.substring(index),
        });
    }

    return result;
}
