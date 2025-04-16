import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import { Memory } from 'Types/source';

import * as Template from 'wml!Controls-demo/gridNew/Sorting/SortingIcons/SortingIcons';

const SORTING_PARAMS = [
    {
        title: 'По алфавиту (регионализация)',
        key: 'Alphabet',
        icon: 'FONT:Controls-icons/sort:icon-Alphabet',
    },
    {
        title: 'По дате',
        key: 'Date',
        icon: 'FONT:Controls-icons/sort:icon-Date',
    },
    {
        title: 'По сроку',
        key: 'Deadline',
        icon: 'FONT:Controls-icons/sort:icon-Deadline',
    },
    {
        title: 'По долгам',
        key: 'Debt',
        icon: 'FONT:Controls-icons/sort:icon-Debt',
    },
    {
        title: 'По кол-ву отклонений',
        key: 'Div',
        icon: 'FONT:Controls-icons/sort:icon-Div',
    },
    {
        title: 'По отзывам',
        key: 'Heart',
        icon: 'FONT:Controls-icons/sort:icon-Heart',
    },
    {
        title: 'По актуальности / времени в работе',
        key: 'InWork',
        icon: 'FONT:Controls-icons/sort:icon-inWork',
    },
    {
        title: 'По людям',
        key: 'Man',
        icon: 'FONT:Controls-icons/sort:icon-Man',
    },
    {
        title: 'По количеству',
        key: 'Number',
        icon: 'FONT:Controls-icons/sort:icon-Number',
    },
    {
        title: 'По порядку',
        key: 'Order',
        icon: 'FONT:Controls-icons/sort:icon-Order',
    },
    {
        title: 'По сложности',
        key: 'Other',
        icon: 'FONT:Controls-icons/sort:icon-Other',
    },
    {
        title: 'По цене',
        key: 'Price',
        icon: 'FONT:Controls-icons/sort:icon-Price',
    },
    {
        title: 'По проблемам',
        key: 'Problem',
        icon: 'FONT:Controls-icons/sort:icon-Problem',
    },
    {
        title: 'По оценкам',
        key: 'Rating',
        icon: 'FONT:Controls-icons/sort:icon-Rating',
    },
    {
        title: 'По сумме',
        key: 'Sum',
        icon: 'FONT:Controls-icons/sort:icon-Sum',
    },
    {
        title: 'По времени',
        key: 'Time',
        icon: 'FONT:Controls-icons/sort:icon-Time',
    },
];

/**
 * Демка для автотеста по существующим иконкам сортировки
 * https://online.sbis.ru/opendoc.html?guid=b7838861-f2bb-4a78-a566-f767a9e9d8f3
 */
export default class IconSize extends Control<IControlOptions> {
    protected _template: TemplateFunction = Template;
    protected _source: Memory;
    protected _sourceASC: Memory;
    protected _sourceDESC: Memory;

    protected _beforeMount(): void {
        this._source = new Memory({
            data: [
                ...SORTING_PARAMS,
                {
                    title: 'Без сортировки',
                    key: 'non_sort',
                    icon: 'FONT:Controls-icons/sort:icon-NonSort',
                },
                {
                    title: 'По порядку',
                    key: 'custom',
                    icon: 'FONT:Controls-icons/sort:icon-SortStandart',
                },
            ],
            keyProperty: 'key',
        });
        this._sourceASC = new Memory({
            data: SORTING_PARAMS.map((item) => {
                return { ...item, icon: item.icon + '_ASC' };
            }),
            keyProperty: 'key',
        });
        this._sourceDESC = new Memory({
            data: SORTING_PARAMS.map((item) => {
                return { ...item, icon: item.icon + '_DESC' };
            }),
            keyProperty: 'key',
        });
    }

    static _styles: string[] = ['Controls-demo/Menu/Menu'];
}
