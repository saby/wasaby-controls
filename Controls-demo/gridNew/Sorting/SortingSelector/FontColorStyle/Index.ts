import { Control, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-demo/gridNew/Sorting/SortingSelector/FontColorStyle/Template';

export default class extends Control {
    protected _template: TemplateFunction = Template;
    protected _sortingParams: object[] = [];
    private _sorting: object[] = [];

    protected _beforeMount(): void {
        this._sortingParams = [
            {
                title: 'По населению',
                paramName: 'population',
            },
            {
                title: 'По площади',
                paramName: 'square',
            },
            {
                title: 'По плотности населения',
                paramName: 'populationDensity',
            },
        ];
        this._sorting.push({ population: 'ASC' });
    }
}
