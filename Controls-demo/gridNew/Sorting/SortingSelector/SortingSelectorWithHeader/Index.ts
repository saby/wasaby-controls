import { Control, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-demo/gridNew/Sorting/SortingSelector/SortingSelectorWithHeader/SortingSelectorWithHeader';
import { Memory } from 'Types/source';
import { Countries } from 'Controls-demo/gridNew/DemoHelpers/Data/Countries';

export default class extends Control {
    protected _template: TemplateFunction = Template;
    protected _sortingParams: object[] = [];
    private _sorting: object[] = [];
    protected _viewSource: Memory;
    protected _menuHeader: string = 'Сортировать';
    protected _columns: object[] = Countries.getColumnsWithWidths();

    protected _beforeMount(): void {
        this._viewSource = new Memory({
            keyProperty: 'key',
            data: Countries.getData(),
        });

        this._sortingParams = [
            {
                title: 'По порядку',
                paramName: null,
                icon: 'Controls/sortIcons:non_sort',
            },
            {
                title: 'По населению',
                paramName: 'population',
                icon: 'Controls/sortIcons:number',
            },
            {
                title: 'По площади',
                paramName: 'square',
                icon: 'Controls/sortIcons:number',
            },
            {
                title: 'По плотности населения',
                paramName: 'populationDensity',
                icon: 'Controls/sortIcons:rating',
            },
        ];
        this._sorting.push({ population: 'ASC' });
    }
}
