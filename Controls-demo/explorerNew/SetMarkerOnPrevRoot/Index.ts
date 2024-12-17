import { Control, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-demo/explorerNew/SetMarkerOnPrevRoot/Template';
import { Gadgets } from '../DataHelpers/DataCatalog';
import { IColumn } from 'Controls/grid';
import { TRoot } from 'Controls-demo/types';
import { HierarchicalMemory } from 'Types/source';

const DATA_COUNT = 500;
function generateData(count: number): object[] {
    const data = [];
    for (let i = 0; i < count; i++) {
        data.push({
            key: i,
            title: `Элемент с key = ${i}`,
            parent: i < 100 ? null : i % 100,
            'parent@': true,
        });
    }
    return data;
}

export default class extends Control {
    protected _template: TemplateFunction = Template;
    protected _viewSource: HierarchicalMemory;
    protected _columns: IColumn[] = [{ displayProperty: 'title' }];
    protected _viewMode: string = 'table';
    protected _root: TRoot = null;

    protected _beforeMount(): void {
        this._viewSource = new HierarchicalMemory({
            keyProperty: 'key',
            parentProperty: 'parent',
            data: generateData(DATA_COUNT),
        });
    }
}
