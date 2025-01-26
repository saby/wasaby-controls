import { Control, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-demo/gridNew/Sorting/SortingSelector/IconStyle/Template';

export default class extends Control {
    protected _template: TemplateFunction = Template;
    protected _sortingParams: object[] = [];
    private _sorting: object[] = [];

    protected _beforeMount(): void {
        this._sortingParams = [
            {
                title: 'По порядку',
                paramName: null,
                icon: 'Controls-icons/sort:icon-NonSort',
                iconStyle: 'readonly',
            },
            {
                title: 'По времени',
                paramName: 'time',
                icon: 'Controls-icons/sort:icon-Time',
                iconStyle: 'secondary',
            },
            {
                title: 'По оценкам',
                paramName: 'rating',
                icon: 'Controls-icons/sort:icon-Rating',
                iconStyle: 'label',
            },
            {
                title: 'По цене',
                paramName: 'price',
                icon: 'Controls-icons/sort:icon-Price',
                iconStyle: 'danger',
            },
            {
                title: 'По дате',
                paramName: 'date',
                icon: 'Controls-icons/sort:icon-Date',
                iconStyle: 'success',
            },
        ];
        this._sorting.push({ time: 'ASC' });
    }
}
