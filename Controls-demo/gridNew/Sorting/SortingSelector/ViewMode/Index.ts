import { Control, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-demo/gridNew/Sorting/SortingSelector/ViewMode/Template';

export default class extends Control {
    protected _template: TemplateFunction = Template;
    protected _sortingParams: object[] = [];
    private _sorting: object[] = [];

    protected _beforeMount(): void {
        this._sortingParams = [
            {
                title: 'По порядку',
                paramName: null,
                icon: 'Controls-icons/sort:icon-Order',
            },
            {
                title: 'По площади',
                paramName: 'square',
                icon: 'Controls-icons/sort:icon-Div',
            },
            {
                title: 'По плотности населения',
                paramName: 'populationDensity',
                icon: 'Controls-icons/sort:icon-Other',
            },
        ];
    }
}
