import { IText } from 'Controls/baseDecorator';
import { __Util, ISelection, ISplitValue } from 'Controls/input';
import { transliterate } from 'Controls/input';
import { controller as i18Controller } from 'I18n/i18n';

describe('Controls/input:__Util', () => {
    describe('textBySplitValue', () => {
        const defaultSV: ISplitValue = {
            before: 'test',
            insert: '',
            after: ' value',
            delete: '',
        };
        const defaultInsert: string = ' test';
        it(`Значение "${defaultSV.before}${defaultSV.after}" без вставки`, () => {
            const actual: IText = __Util.textBySplitValue({ ...defaultSV });
            const expected: IText = {
                value: 'test value',
                carriagePosition: 4,
            };
            expect(actual).toEqual(expected);
        });
        it(`Значение "${defaultSV.before}${defaultSV.after}" со вставкой "${defaultInsert}"`, () => {
            const actual = __Util.textBySplitValue({
                ...defaultSV,
                insert: defaultInsert,
            });
            const expected: IText = {
                value: 'test test value',
                carriagePosition: 9,
            };
            expect(actual).toEqual(expected);
        });
    });
    describe('splitValueForPasting', () => {
        const carriagePosition: ISelection = {
            start: 2,
            end: 2,
        };
        const selection: ISelection = {
            start: 2,
            end: 4,
        };
        it('Вставка пустого значения', () => {
            const actual: ISplitValue = __Util.splitValueForPasting(
                'test value',
                carriagePosition,
                ''
            );
            const expected: ISplitValue = {
                before: 'te',
                insert: '',
                delete: '',
                after: 'st value',
            };
            expect(actual).toEqual(expected);
        });
        it('Вставка "test"', () => {
            const actual: ISplitValue = __Util.splitValueForPasting(
                'test value',
                carriagePosition,
                'test'
            );
            const expected: ISplitValue = {
                before: 'te',
                insert: 'test',
                delete: '',
                after: 'st value',
            };
            expect(actual).toEqual(expected);
        });
        it('Вставка пустого значения вместо выделенного текста', () => {
            const actual: ISplitValue = __Util.splitValueForPasting(
                'test value',
                selection,
                ''
            );
            const expected: ISplitValue = {
                before: 'te',
                insert: '',
                delete: 'st',
                after: ' value',
            };
            expect(actual).toEqual(expected);
        });
        it('Вставка "test" вместо выделенного текста', () => {
            const actual: ISplitValue = __Util.splitValueForPasting(
                'test value',
                selection,
                'test'
            );
            const expected: ISplitValue = {
                before: 'te',
                insert: 'test',
                delete: 'st',
                after: ' value',
            };
            expect(actual).toEqual(expected);
        });
    });
    describe('hasSelectionChanged', () => {
        const carriagePosition: number = 10;
        it('Изначально есть выделение', () => {
            const actual: boolean = __Util.hasSelectionChanged(
                {
                    start: 0,
                    end: 5,
                },
                carriagePosition
            );
            expect(actual).toBe(true);
        });
        it('Позиция начала и конца выделение совпадают, но не равна позиции каретки.', () => {
            const actual: boolean = __Util.hasSelectionChanged(
                {
                    start: 0,
                    end: 5,
                },
                carriagePosition
            );
            expect(actual).toBe(true);
        });
    });
    describe('.transliterateSelectedText()', () => {
        /* eslint-disable max-len */
        const cases = [
            {
                testName: 'Без выделения текста',
                revertedText: 'Hello',
                value: 'Руддщ',
                expected: 'Hello',
            },
            {
                testName: 'С выделением текста',
                revertedText: 'уд',
                value: 'Hello',
                selection: { start: 1, end: 3 },
                expected: 'Hудlo',
            },
            {
                testName: 'С выделением всего текста',
                revertedText: 'Руддщ',
                value: 'Hello',
                selection: { start: 0, end: 5 },
                expected: 'Руддщ',
            },
        ];
        /* eslint-enable max-len */

        const transliterateSelectedText =
            transliterate._transliterateSelectedText;

        cases.forEach((item) => {
            it(item.testName, () => {
                expect(
                    transliterateSelectedText(
                        item.revertedText,
                        item.value,
                        item.selection
                    )
                ).toEqual(item.expected);
            });
        });
    });
    describe('.transliterateInput()', () => {
        /* eslint-disable max-len */
        const cases = [
            {
                testName:
                    'Курсор в конце строки (текст не совпадает с транслитерацией)',
                value: 'Hello',
                selection: { start: 5, end: 5 },
                locale: 'ru-Ru',
                expected: 'Руддщ',
            },
            {
                testName:
                    'Курсор в конце строки (текст совпадает с транслитерацией)',
                value: 'Hello',
                selection: { start: 5, end: 5 },
                locale: 'en-En',
                expected: 'Руддщ',
            },
            {
                testName:
                    'Выделен текст (текст не совпадает с транслитерацией)',
                value: 'Hello',
                selection: { start: 1, end: 3 },
                locale: 'ru-RU',
                expected: 'Hудlo',
            },
            {
                testName: 'Выделен текст (текст совпадает с транслитерацией)',
                value: 'Hello',
                selection: { start: 1, end: 3 },
                locale: 'en-En',
                expected: 'Hудlo',
            },
            {
                testName:
                    'Выделен весь текст (текст не совпадает с транслитерацией)',
                value: 'Hello',
                selection: { start: 0, end: 5 },
                locale: 'ru-RU',
                expected: 'Руддщ',
            },
            {
                testName:
                    'Выделен весь текст (текст совпадает с транслитерацией)',
                value: 'Hello',
                selection: { start: 0, end: 5 },
                locale: 'en-En',
                expected: 'Руддщ',
            },
        ];
        /* eslint-enable max-len */
        cases.forEach((item) => {
            it(item.testName, async () => {
                jest.spyOn(i18Controller, 'currentLocale', 'get')
                    .mockClear()
                    .mockImplementation(() => {
                        return item.locale;
                    });
                const value = await transliterate(item.value, item.selection);
                expect(value).toEqual(item.expected);
            });
        });
    });
});
