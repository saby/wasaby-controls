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
    const { value, highlightMode, strictSearch } = data;
    if (value === undefined || value === null) {
        return [];
    }
    const newValue = typeof value === 'string' ? value : String(value);

    if (isIndexesArray(data.highlightedValue)) {
        return normalizeHighlights(newValue, data.highlightedValue);
    }

    const highlightedValue = Array.isArray(data.highlightedValue)
        ? data.highlightedValue
        : [data.highlightedValue];
    if (highlightedValue.length && highlightedValue.filter(isNotEmpty).length !== 0) {
        return parseText(newValue, highlightedValue, highlightMode || 'substring', strictSearch);
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
    highlightMode: HighlightMode,
    strictSearch?: boolean
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
            highlight.length > maxLength ? highlight.substring(0, maxLength) : highlight;
        escapedHighlights.push(escapeSpecialChars(limitHighlight));
    });
    const searchResultByAnd: Element[] = searchBy(
        value,
        escapedHighlights,
        highlightMode,
        'and',
        strictSearch
    );

    if (searchResultByAnd.length) {
        return searchResultByAnd;
    }
    // Так как мы экранируем точку, то при or точка является разделителем, из-за чего получаем регулярку text\|text.
    // Хотя ожидаем text|text, поэтому отменяем экранирование для точки.
    const escapedHighlightsReplaced = escapedHighlights.map((escapedHighlight) => {
        return escapedHighlight.replace(/\\./g, '.');
    });
    return searchBy(value, escapedHighlightsReplaced, highlightMode, 'or', strictSearch);
}

function searchBy(
    value: string,
    highlights: string[],
    highlightMode: HighlightMode,
    by: SearchBy,
    strictSearch?: boolean
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

    let highlightSearchResult: ISearchResult[] = [];

    if (strictSearch) {
        highlightSearchResult = searchInStrictMode(value, words, highlightMode);
    } else {
        const regexp: RegExp = calculateRegExp(words, highlightMode);
        highlightSearchResult = search(value, regexp);
    }

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

function searchInStrictMode(value: string, searchWords: string[]): ISearchResult[] {
    const searchResult: ISearchResult[] = [];

    const regPattern = searchWords
        .map((item) => `(${item})`)
        .join('[\\w\\W]+')
        .replace(/([её])/gi, '[её]');

    const found = value.match(new RegExp(regPattern, 'i'));

    let length: number;

    if (found) {
        searchResult.push({
            value: found[1],
            index: found.index,
        });

        length = found[1].length;

        for (let i = 2; i < found.length; i++) {
            const index = found[0].indexOf(found[i], length);
            searchResult.push({
                index: index + found.index,
                value: found[i],
            });
            length = index + found[i].length;
        }
    }

    return searchResult;
}

function calculateRegExp(valueArr: string[], highlightMode: HighlightMode): RegExp {
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

function isIndexesArray(anyObj: unknown): anyObj is [number, number][] {
    return (
        Array.isArray(anyObj) &&
        anyObj.filter(
            (i) => Array.isArray(i) && typeof i[0] === 'number' && typeof i[1] === 'number'
        ).length === anyObj.length
    );
}

function normalizeHighlights(value: string, highlights: [number, number][]): Element[] {
    const points: (true | undefined)[] = [];

    // Выколем всё подсвеченное.
    highlights.forEach(([startIndex, stopIndex]) => {
        if (startIndex <= stopIndex) {
            for (let i = startIndex; i <= stopIndex; i++) {
                points[i] = true;
            }
        } else {
            Logger.warn(
                `Неверные индексы для подсветки: [${startIndex}, ${stopIndex}]! ` +
                    'Данная пара будет проигнорирована.'
            );
        }
    });

    const maxLength = Math.min(value.length, points.length);

    // Соберем границы
    const pairs: [number, number | undefined, boolean][] = [[0, -1, !!points[0]]];
    const result: Element[] = [];

    const getElement = (v: [number, number | undefined, boolean]): Element => ({
        type: v[2] ? 'highlight' : 'plain',
        value: value.substring(v[0], v[1]),
    });

    // Идем по всем ранее подсвеченным буквам.
    // Сравниваем состояние текущей и прошлой буквы.
    // Если они отличаются, то закрываем прошлую подстроку и открыть новую, с новым состоянием.
    for (let i = 1; i < maxLength; i++) {
        const last = pairs[pairs.length - 1];

        if (!!points[i] !== !!last[2]) {
            last[1] = i;
            // Сразу запоминаем закрытую строку, чтобы снизить общую сложность.
            result.push(getElement(last));
            pairs.push([i, -1, !!points[i]]);
        }
    }

    // Последняя подстрока будет незакрыта, закрываем.
    const last = pairs[pairs.length - 1];
    if (last[1] === -1) {
        last[1] = Math.min(maxLength, value.length - 1);
        result.push(getElement(last));
    }

    // Последняя подстрока может быть не последней в строке (т.к. особенность заполнения массива).
    // Не value.length - 1, т.к. в парах индексов точки не выколотые, [1, 2] подсветит два символа.
    if (last[1] !== value.length) {
        pairs.push([last[1] as number, value.length, false]);
        result.push(getElement(pairs[pairs.length - 1]));
    }

    return result;
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
