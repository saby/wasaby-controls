import { Control, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-demo/gridNew/Sorting/SortingSelector/IconsSvg/Template';

const SORTING_PARAMS = [
    {
        title: 'По алфавиту (регионализация)',
        paramName: 'alphabet_ru',
        icon: 'Controls-icons/sort:icon-Alphabet',
    },
    {
        title: 'По времени',
        paramName: 'time',
        icon: 'Controls-icons/sort:icon-Time',
    },
    {
        title: 'По дате',
        paramName: 'date',
        icon: 'Controls-icons/sort:icon-Date',
    },
    {
        title: 'По доглам',
        paramName: 'debt',
        icon: 'Controls-icons/sort:icon-Debt',
    },
    {
        title: 'По отклонению',
        paramName: 'deflection',
        icon: 'Controls-icons/sort:icon-Div',
    },
    {
        title: 'По количеству',
        paramName: 'number',
        icon: 'Controls-icons/sort:icon-Number',
    },
    {
        title: 'По людям',
        paramName: 'partner',
        icon: 'Controls-icons/sort:icon-Man',
    },
    {
        title: 'По отзывам',
        paramName: 'recall',
        icon: 'Controls-icons/sort:icon-Heart',
    },
    {
        title: 'По проблемам',
        paramName: 'problem',
        icon: 'Controls-icons/sort:icon-Problem',
    },
    {
        title: 'По оценкам',
        paramName: 'rating',
        icon: 'Controls-icons/sort:icon-Rating',
    },
    {
        title: 'По сроку',
        paramName: 'timing',
        icon: 'Controls-icons/sort:icon-Deadline',
    },
    {
        title: 'По сумме',
        paramName: 'sum',
        icon: 'Controls-icons/sort:icon-Sum',
    },
    {
        title: 'По цене',
        paramName: 'price',
        icon: 'Controls-icons/sort:icon-Price',
    },
    {
        title: 'По сложности',
        paramName: 'difficult_sort',
        icon: 'Controls-icons/sort:icon-Other',
    },
];

export default class extends Control {
    protected _template: TemplateFunction = Template;
    protected _sortingParams: object[] = [];
    protected _sortingParamsCustom: object[] = [];

    protected _beforeMount(): void {
        this._sortingParams = [
            {
                title: 'Без сортировки',
                paramName: null,
                icon: 'Controls-icons/sort:icon-NonSort',
            },
            ...SORTING_PARAMS,
        ];
        this._sortingParamsCustom = [
            {
                title: 'По порядку',
                paramName: null,
                icon: 'Controls-icons/sort:icon-Order',
            },
            ...SORTING_PARAMS,
        ];
    }
}
