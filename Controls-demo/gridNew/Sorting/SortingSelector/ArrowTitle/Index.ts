import { Control, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-demo/gridNew/Sorting/SortingSelector/ArrowTitle/Template';

export default class extends Control {
    protected _template: TemplateFunction = Template;
    protected _sortingParams: object[] = [];
    private _sorting: object[] = [];

    protected _beforeMount(): void {
        this._sortingParams = [
            {
                title: 'Без сортировки',
                paramName: null,
                icon: 'Controls-icons/sort:icon-NonSort',
            },
            {
                title: 'По времени',
                paramName: 'time',
                icon: 'Controls-icons/sort:icon-Time',
                titleAsc: 'Сначала старые',
                titleDesc: 'Сначала новые',
            },
            {
                title: 'По оценкам',
                paramName: 'rating',
                icon: 'Controls-icons/sort:icon-Rating',
                titleAsc: 'Сначала худшие',
                titleDesc: 'Сначала лучшие',
            },
            {
                title: 'По цене',
                paramName: 'price',
                icon: 'Controls-icons/sort:icon-Price',
                titleAsc: 'Сначала дешевые',
                titleDesc: 'Сначала дорогие',
            },
        ];
    }
}
