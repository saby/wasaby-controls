import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import { Memory } from 'Types/source';

import * as Template from 'wml!Controls-demo/gridNew/Sorting/SortingIcons/SortingIcons';

const SORTING_PARAMS = [
    {
        title: 'По алфавиту (рус)',
        key: 'alphabet_ru',
        icon: 'Controls/sortIcons:alphabet_ru',
    },
    {
        title: 'По алфавиту (eng)',
        key: 'alphabet_en',
        icon: 'Controls/sortIcons:alphabet_en',
    },
    {
        title: 'По времени',
        key: 'time',
        icon: 'Controls/sortIcons:time',
    },
    {
        title: 'По дате',
        key: 'date',
        icon: 'Controls/sortIcons:date',
    },
    {
        title: 'По доглам',
        key: 'debt',
        icon: 'Controls/sortIcons:debt',
    },
    {
        title: 'По отклонению',
        key: 'deflection',
        icon: 'Controls/sortIcons:deflection',
    },
    {
        title: 'По количеству',
        key: 'number',
        icon: 'Controls/sortIcons:number',
    },
    {
        title: 'По людям',
        key: 'partner',
        icon: 'Controls/sortIcons:partner',
    },
    {
        title: 'По отзывам',
        key: 'recall',
        icon: 'Controls/sortIcons:recall',
    },
    {
        title: 'По проблемам',
        key: 'problem',
        icon: 'Controls/sortIcons:problem',
    },
    {
        title: 'По оценкам',
        key: 'rating',
        icon: 'Controls/sortIcons:rating',
    },
    {
        title: 'По сроку',
        key: 'timing',
        icon: 'Controls/sortIcons:timing',
    },
    {
        title: 'По сумме',
        key: 'sum',
        icon: 'Controls/sortIcons:sum',
    },
    {
        title: 'По цене',
        key: 'price',
        icon: 'Controls/sortIcons:price',
    },
    {
        title: 'По сложности',
        key: 'difficult_sort',
        icon: 'Controls/sortIcons:difficult_sort',
    },
    {
        title: 'По актуальности / времени в работе',
        key: 'in_work',
        icon: 'Controls/sortIcons:in_work',
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
                    icon: 'Controls/sortIcons:non_sort',
                },
                {
                    title: 'По порядку',
                    key: 'custom',
                    icon: 'Controls/sortIcons:custom',
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
