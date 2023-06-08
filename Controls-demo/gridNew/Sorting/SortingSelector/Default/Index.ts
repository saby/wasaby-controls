import { Control, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-demo/gridNew/Sorting/SortingSelector/Default/Default';
import { Memory } from 'Types/source';
import { IColumn } from 'Controls/grid';
import { Countries } from 'Controls-demo/gridNew/DemoHelpers/Data/Countries';

export default class extends Control {
    protected _template: TemplateFunction = Template;
    protected _sortingParams: object[] = [];
    private _sorting: object[] = [];
    protected _viewSource: Memory;
    protected _columns: IColumn[] = Countries.getColumnsWithWidths();

    protected _beforeMount(): void {
        this._viewSource = new Memory({
            keyProperty: 'key',
            data: Countries.getData(),
        });
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
