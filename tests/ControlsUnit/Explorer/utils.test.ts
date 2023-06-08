/* eslint-disable no-magic-numbers */
import {
    calculateBreadcrumbsLayout,
    detectGoingBackByPath,
    getCursorValue,
    getHeaderVisibility,
    IBreadcrumbsLayout,
    isCursorNavigation,
    needBackButtonInHeader,
} from 'Controls/_explorer/utils';
import { Model } from 'Types/entity';
import { RecordSet } from 'Types/collection';
import { IHeaderCell, THeaderVisibility } from 'Controls/grid';
import { generatePath } from 'ControlsUnit/Explorer/TestExplorer';
import {
    INavigationOptionValue,
    INavigationPositionSourceConfig,
} from 'Controls/interface';

describe('Explorer utils', () => {
    it('needBackButtonInHeader', () => {
        let result: boolean;

        result = needBackButtonInHeader([{}], 'visible');
        expect(result).toBe(true);

        result = needBackButtonInHeader([{ caption: 'test' }], 'visible');
        expect(result).toBe(false);

        result = needBackButtonInHeader(
            [{ title: 'test' } as IHeaderCell],
            'visible'
        );
        expect(result).toBe(false);

        result = needBackButtonInHeader([{ template: 'test' }], 'visible');
        expect(result).toBe(false);

        result = needBackButtonInHeader([{}], 'hidden');
        expect(result).toBe(false);
    });

    it('getHeaderVisibility', () => {
        let result: THeaderVisibility;

        // region Крошки скрыты
        result = getHeaderVisibility(1, null, [{}], 'visible', 'hidden');
        expect(result).toEqual('visible');

        result = getHeaderVisibility(1, null, [{}], undefined, 'hidden');
        expect(result).toEqual('hasdata');
        // endregion

        // region Задано содержимое первой ячейки заголовка
        result = getHeaderVisibility(
            1,
            null,
            [{ caption: 'test' }],
            'visible',
            'visible'
        );
        expect(result).toEqual('visible');

        result = getHeaderVisibility(
            1,
            null,
            [{ caption: 'test' }],
            undefined,
            'visible'
        );
        expect(result).toEqual('hasdata');
        // endregion

        // region Содержимое первой ячейки заголовка не задано, видимость заголовка определяется на основании рутов
        result = getHeaderVisibility(1, null, [{}], 'hasdata', 'visible');
        expect(result).toEqual('visible');

        result = getHeaderVisibility(null, null, [{}], 'visible', 'visible');
        expect(result).toEqual('visible');
        // endregion
    });

    it('detectGoingBackByPath', () => {
        const oldPath = generatePath(3);
        const newPath = generatePath(2);

        expect(detectGoingBackByPath(oldPath, newPath)).toBe(true);
        expect(detectGoingBackByPath(newPath, oldPath)).toBe(false);
        expect(detectGoingBackByPath(newPath, newPath)).toBe(false);
    });

    it('isCursorNavigation', () => {
        expect(isCursorNavigation({})).toBe(false);
        expect(isCursorNavigation({ source: 'page' })).toBe(false);
        expect(isCursorNavigation({ source: 'position' })).toBe(true);
    });

    it('getCursorPositionFor', () => {
        const item = new Model({
            keyProperty: 'id',
            rawData: {
                id: 12,
                title: 'Title',
            },
        });
        const navigation = {
            sourceConfig: {
                field: 'id',
            },
        } as INavigationOptionValue<INavigationPositionSourceConfig>;

        expect(getCursorValue(item, navigation)).toEqual([12]);

        navigation.sourceConfig.field = ['id'];
        expect(getCursorValue(item, navigation)).toEqual([12]);

        navigation.sourceConfig.field = ['id', 'title'];
        expect(getCursorValue(item, navigation)).toEqual([12, 'Title']);
    });

    describe('calculateBreadcrumbsLayout', () => {
        function createRS(
            itemsCount: number = 0,
            emptyResult: boolean = true
        ): RecordSet {
            const rawData = [];
            for (let i = 0; i < itemsCount; i++) {
                rawData.push({ id: i + 1, parent: null });
            }

            const rs = new RecordSet({
                rawData,
                keyProperty: 'id',
            });
            rs.setMetaData({
                results: Model.fromObject(
                    { id: emptyResult ? '' : 1 },
                    rs.getAdapter()
                ),
            });

            return rs;
        }

        it('by viewMode', () => {
            let layout: IBreadcrumbsLayout;

            // Для списочного представления крошки и кнопка "Назад" должны быть сверху
            layout = calculateBreadcrumbsLayout(
                {
                    viewMode: 'list',
                    // У первой колонке не задан кастомный шаблон результатов
                    columns: [
                        {
                            displayProperty: 'id',
                            resultTemplate: '',
                        },
                    ],
                    // Рендер строки итогов не перекрыт
                    resultsTemplate: '',
                    // Строка итогов позиционируется сверху
                    resultsPosition: 'top',
                    // Строка итогов видна всегда
                    resultsVisibility: 'visible',
                    parentProperty: 'parent',
                    root: null,
                },
                // Данных нет
                createRS(0)
            );
            expect(layout.backButtonPosition).toBe('top');
            expect(layout.breadcrumbsPosition).toBe('top');

            // Для плиточного представления крошки и кнопка "Назад" должны быть сверху
            layout = calculateBreadcrumbsLayout(
                {
                    viewMode: 'tile',
                    // У первой колонке не задан кастомный шаблон результатов
                    columns: [
                        {
                            displayProperty: 'id',
                            resultTemplate: '',
                        },
                    ],
                    // Рендер строки итогов не перекрыт
                    resultsTemplate: '',
                    // Строка итогов позиционируется сверху
                    resultsPosition: 'top',
                    // Строка итогов видна всегда
                    resultsVisibility: 'visible',
                    parentProperty: 'parent',
                    root: null,
                },
                // Данных нет
                createRS(0)
            );
            expect(layout.backButtonPosition).toBe('top');
            expect(layout.breadcrumbsPosition).toBe('top');
        });

        it('by breadcrumbsVisibility', () => {
            let layout: IBreadcrumbsLayout;

            // Крошки и кнопка "Назад" скрыты по breadcrumbsVisibility
            layout = calculateBreadcrumbsLayout(
                {
                    breadcrumbsVisibility: 'hidden',
                    viewMode: 'table',
                    // У первой колонке не задан кастомный шаблон результатов
                    columns: [
                        {
                            displayProperty: 'id',
                            resultTemplate: '',
                        },
                    ],
                    // Рендер строки итогов не перекрыт
                    resultsTemplate: '',
                    // Строка итогов позиционируется сверху
                    resultsPosition: 'top',
                    // Строка итогов видна если в списке больше 1 записи
                    resultsVisibility: 'hasdata',
                    parentProperty: 'parent',
                    root: null,
                },
                // Данных достаточно
                createRS(2)
            );
            expect(layout.backButtonPosition).toBe(undefined);
            expect(layout.breadcrumbsPosition).toBe(undefined);

            // Крошки скрыты по breadcrumbsVisibility, отображается только кнопка "Назад"
            layout = calculateBreadcrumbsLayout(
                {
                    breadcrumbsVisibility: 'onlyBackButton',
                    viewMode: 'table',
                    // У первой колонке не задан кастомный шаблон результатов
                    columns: [
                        {
                            displayProperty: 'id',
                            resultTemplate: '',
                        },
                    ],
                    // Рендер строки итогов не перекрыт
                    resultsTemplate: '',
                    // Строка итогов позиционируется сверху
                    resultsPosition: 'top',
                    // Строка итогов видна если в списке больше 1 записи
                    resultsVisibility: 'hasdata',
                    parentProperty: 'parent',
                    root: null,
                },
                // Данных достаточно
                createRS(2)
            );
            expect(layout.backButtonPosition).toBe('results');
            expect(layout.breadcrumbsPosition).toBe(undefined);
        });

        it('by results', () => {
            let layout: IBreadcrumbsLayout;

            // Без заголовков, конфигурация строки итогов позволяет вывести там кнопку назад
            layout = calculateBreadcrumbsLayout(
                {
                    viewMode: 'table',
                    // У первой колонке не задан кастомный шаблон результатов
                    columns: [
                        {
                            displayProperty: 'id',
                            resultTemplate: '',
                        },
                    ],
                    // Рендер строки итогов не перекрыт
                    resultsTemplate: '',
                    // Строка итогов позиционируется сверху
                    resultsPosition: 'top',
                    // Строка итогов видна всегда
                    resultsVisibility: 'visible',
                    parentProperty: 'parent',
                    root: null,
                },
                // Данных нет
                createRS(0)
            );
            expect(layout.backButtonPosition).toBe('results');
            expect(layout.breadcrumbsPosition).toBe('top');

            // Без заголовков, конфигурация строки итогов не позволяет вывести там кнопку назад
            // из-за resultsVisibility и данных
            layout = calculateBreadcrumbsLayout(
                {
                    viewMode: 'table',
                    // У первой колонке не задан кастомный шаблон результатов
                    columns: [
                        {
                            displayProperty: 'id',
                            resultTemplate: '',
                        },
                    ],
                    // Рендер строки итогов не перекрыт
                    resultsTemplate: '',
                    // Строка итогов позиционируется сверху
                    resultsPosition: 'top',
                    /** Строка итогов видна если в списке больше 1 записи */
                    resultsVisibility: 'hasdata',
                    parentProperty: 'parent',
                    root: null,
                },
                /** Данных нет */
                createRS(1)
            );
            expect(layout.backButtonPosition).toBe('top');
            expect(layout.breadcrumbsPosition).toBe('top');

            // Без заголовков, конфигурация строки итогов позволяет вывести там кнопку назад
            layout = calculateBreadcrumbsLayout(
                {
                    viewMode: 'table',
                    // У первой колонке не задан кастомный шаблон результатов
                    columns: [
                        {
                            displayProperty: 'id',
                            resultTemplate: '',
                        },
                    ],
                    // Рендер строки итогов не перекрыт
                    resultsTemplate: '',
                    // Строка итогов позиционируется сверху
                    resultsPosition: 'top',
                    // Строка итогов видна если в списке больше 1 записи
                    resultsVisibility: 'hasdata',
                    parentProperty: 'parent',
                    root: null,
                },
                // Данных достаточно
                createRS(2)
            );
            expect(layout.backButtonPosition).toBe('results');
            expect(layout.breadcrumbsPosition).toBe('top');

            // Без заголовков, конфигурация строки итогов не позволяет вывести там кнопку назад
            // из-за resultsPosition
            layout = calculateBreadcrumbsLayout(
                {
                    viewMode: 'table',
                    // У первой колонке не задан кастомный шаблон результатов
                    columns: [
                        {
                            displayProperty: 'id',
                            resultTemplate: '',
                        },
                    ],
                    // Рендер строки итогов не перекрыт
                    resultsTemplate: '',
                    /** Строка итогов позиционируется снизу */
                    resultsPosition: 'bottom',
                    // Строка итогов видна если в списке больше 1 записи
                    resultsVisibility: 'hasdata',
                    parentProperty: 'parent',
                    root: null,
                },
                // Данных достаточно
                createRS(2)
            );
            expect(layout.backButtonPosition).toBe('top');
            expect(layout.breadcrumbsPosition).toBe('top');

            // Без заголовков, конфигурация строки итогов не позволяет вывести там кнопку назад
            // из-за resultsTemplate
            layout = calculateBreadcrumbsLayout(
                {
                    viewMode: 'table',
                    // У первой колонке не задан кастомный шаблон результатов
                    columns: [
                        {
                            displayProperty: 'id',
                            resultTemplate: '',
                        },
                    ],
                    /** !!! Рендер строки итогов перекрыт */
                    resultsTemplate: 'wml!My/Custom/Results',
                    // Строка итогов позиционируется сверху
                    resultsPosition: 'top',
                    // Строка итогов видна если в списке больше 1 записи
                    resultsVisibility: 'hasdata',
                    parentProperty: 'parent',
                    root: null,
                },
                // Данных достаточно
                createRS(2)
            );
            expect(layout.backButtonPosition).toBe('top');
            expect(layout.breadcrumbsPosition).toBe('top');

            // Без заголовков, конфигурация строки итогов не позволяет вывести там кнопку назад
            // из-за columns[0].resultTemplate
            layout = calculateBreadcrumbsLayout(
                {
                    viewMode: 'table',
                    /** У первой колонке задан кастомный шаблон результатов */
                    columns: [
                        {
                            displayProperty: 'id',
                            resultTemplate: 'wml!My/Custom/Results',
                        },
                    ],
                    // Рендер строки итогов не перекрыт
                    resultsTemplate: '',
                    // Строка итогов позиционируется сверху
                    resultsPosition: 'top',
                    // Строка итогов видна если в списке больше 1 записи
                    resultsVisibility: 'hasdata',
                    parentProperty: 'parent',
                    root: null,
                },
                // Данных достаточно
                createRS(2)
            );
            expect(layout.backButtonPosition).toBe('top');
            expect(layout.breadcrumbsPosition).toBe('top');

            // Без заголовков, конфигурация строки итогов позволяет вывести там кнопку назад
            // из-за метаданных
            layout = calculateBreadcrumbsLayout(
                {
                    viewMode: 'table',
                    // У первой колонке не задан кастомный шаблон результатов
                    columns: [
                        {
                            displayProperty: 'id',
                            resultTemplate: '',
                        },
                    ],
                    // Рендер строки итогов не перекрыт
                    resultsTemplate: '',
                    // Строка итогов позиционируется сверху
                    resultsPosition: 'top',
                    // Строка итогов видна всегда
                    resultsVisibility: 'hasdata',
                    parentProperty: 'parent',
                    root: null,
                },
                /** Данных есть, но в метаданных есть значение для первой колонки */
                createRS(2, false)
            );
            expect(layout.backButtonPosition).toBe('top');
            expect(layout.breadcrumbsPosition).toBe('top');
        });

        it('by header', () => {
            let layout: IBreadcrumbsLayout;

            // Конфигурация позволяет вывести крошки в первой ячейке заголовка
            layout = calculateBreadcrumbsLayout(
                {
                    viewMode: 'table',
                    // Первая ячейка заголовка пустая
                    header: [
                        {
                            caption: '',
                            template: '',
                        },
                    ],
                    // Заголовок виден всегда
                    headerVisibility: 'visible',
                    // У первой колонке не задан кастомный шаблон результатов
                    columns: [
                        {
                            displayProperty: 'id',
                            resultTemplate: '',
                        },
                    ],
                    // Рендер строки итогов не перекрыт
                    resultsTemplate: '',
                    // Строка итогов позиционируется сверху
                    resultsPosition: 'top',
                    // Строка итогов видна всегда
                    resultsVisibility: 'visible',
                    parentProperty: 'parent',
                    root: null,
                },
                // Данных нет
                createRS(0)
            );
            expect(layout.backButtonPosition).toBe('results');
            expect(layout.breadcrumbsPosition).toBe('header');

            // Конфигурация не позволяет вывести крошки в первой ячейке заголовка
            // из-за headerVisibility и данных
            layout = calculateBreadcrumbsLayout(
                {
                    viewMode: 'table',
                    // Первая ячейка заголовка пустая
                    header: [
                        {
                            caption: '',
                            template: '',
                        },
                    ],
                    /** Заголовок виден только при наличии данных */
                    headerVisibility: 'hasdata',
                    // У первой колонке не задан кастомный шаблон результатов
                    columns: [
                        {
                            displayProperty: 'id',
                            resultTemplate: '',
                        },
                    ],
                    // Рендер строки итогов не перекрыт
                    resultsTemplate: '',
                    // Строка итогов позиционируется сверху
                    resultsPosition: 'top',
                    // Строка итогов видна всегда
                    resultsVisibility: 'visible',
                    parentProperty: 'parent',
                    root: null,
                },
                /** Данных нет */
                createRS(0)
            );
            expect(layout.backButtonPosition).toBe('results');
            expect(layout.breadcrumbsPosition).toBe('top');

            // Конфигурация позволяет вывести крошки в первой ячейке заголовка
            // по headerVisibility и данным
            layout = calculateBreadcrumbsLayout(
                {
                    viewMode: 'table',
                    // Первая ячейка заголовка пустая
                    header: [
                        {
                            caption: '',
                            template: '',
                        },
                    ],
                    /** Заголовок виден только при наличии данных */
                    headerVisibility: 'hasdata',
                    // У первой колонке не задан кастомный шаблон результатов
                    columns: [
                        {
                            displayProperty: 'id',
                            resultTemplate: '',
                        },
                    ],
                    // Рендер строки итогов не перекрыт
                    resultsTemplate: '',
                    // Строка итогов позиционируется сверху
                    resultsPosition: 'top',
                    // Строка итогов видна всегда
                    resultsVisibility: 'visible',
                    parentProperty: 'parent',
                    root: null,
                },
                /** Данные есть */
                createRS(1)
            );
            expect(layout.backButtonPosition).toBe('results');
            expect(layout.breadcrumbsPosition).toBe('header');

            // Конфигурация не позволяет вывести крошки в первой ячейке заголовка
            // из-за того, что там задан заголовок
            layout = calculateBreadcrumbsLayout(
                {
                    viewMode: 'table',
                    /** Первая ячейка заголовка не пустая */
                    header: [
                        {
                            caption: 'column caption',
                            template: '',
                        },
                    ],
                    // Заголовок виден всегда
                    headerVisibility: 'visible',
                    // У первой колонке не задан кастомный шаблон результатов
                    columns: [
                        {
                            displayProperty: 'id',
                            resultTemplate: '',
                        },
                    ],
                    // Рендер строки итогов не перекрыт
                    resultsTemplate: '',
                    // Строка итогов позиционируется сверху
                    resultsPosition: 'top',
                    // Строка итогов видна всегда
                    resultsVisibility: 'visible',
                    parentProperty: 'parent',
                    root: null,
                },
                // Данных нет
                createRS(0)
            );
            expect(layout.backButtonPosition).toBe('results');
            expect(layout.breadcrumbsPosition).toBe('top');

            // Конфигурация не позволяет вывести крошки в первой ячейке заголовка
            // из-за того, что там задан шаблон
            layout = calculateBreadcrumbsLayout(
                {
                    viewMode: 'table',
                    /** Первая ячейка заголовка не пустая */
                    header: [
                        {
                            caption: '',
                            template: 'wml!My/Custom/ColumnHeader',
                        },
                    ],
                    // Заголовок виден всегда
                    headerVisibility: 'visible',
                    // У первой колонке не задан кастомный шаблон результатов
                    columns: [
                        {
                            displayProperty: 'id',
                            resultTemplate: '',
                        },
                    ],
                    // Рендер строки итогов не перекрыт
                    resultsTemplate: '',
                    // Строка итогов позиционируется сверху
                    resultsPosition: 'top',
                    // Строка итогов видна всегда
                    resultsVisibility: 'visible',
                    parentProperty: 'parent',
                    root: null,
                },
                // Данных нет
                createRS(0)
            );
            expect(layout.backButtonPosition).toBe('results');
            expect(layout.breadcrumbsPosition).toBe('top');
        });
    });
});
