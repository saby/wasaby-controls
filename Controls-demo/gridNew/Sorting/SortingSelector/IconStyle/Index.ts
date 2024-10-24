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
                icon: 'Controls/sortIcons:non_sort',
                iconStyle: 'readonly',
            },
            {
                title: 'По времени',
                paramName: 'time',
                icon: 'Controls/sortIcons:time',
                iconStyle: 'secondary',
            },
            {
                title: 'По оценкам',
                paramName: 'rating',
                icon: 'Controls/sortIcons:rating',
                iconStyle: 'label',
            },
            {
                title: 'По цене',
                paramName: 'price',
                icon: 'Controls/sortIcons:price',
                iconStyle: 'danger',
            },
            {
                title: 'По дате',
                paramName: 'date',
                icon: 'Controls/sortIcons:date',
                iconStyle: 'success',
            },
        ];
        this._sorting.push({ time: 'ASC' });
    }
}
