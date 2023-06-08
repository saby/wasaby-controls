import { Control, TemplateFunction } from 'UI/Base';
import { HierarchicalMemory } from 'Types/source';
import { IColumn } from 'Controls/grid';

import { Flat } from 'Controls-demo/treeGridNew/DemoHelpers/Data/Flat';
import { WithPhoto } from 'Controls-demo/treeGridNew/DemoHelpers/Data/WithPhoto';

import * as Template from 'wml!Controls-demo/MasterDetail/MasterWithPhoto/MasterWithPhoto';

export default class extends Control {
    protected _template: TemplateFunction = Template;
    protected _viewSource: HierarchicalMemory;
    protected _columns: IColumn[] = WithPhoto.getGridColumnsWithPhoto().slice(0, 1);

    protected _beforeMount(): void {
        this._viewSource = new HierarchicalMemory({
            keyProperty: 'key',
            data: Flat.getData(),
            parentProperty: 'parent',
            filter: (): boolean => {
                return true;
            },
        });
    }

    static _styles: string[] = ['Controls-demo/treeGridNew/ItemTemplate/WithPhoto/styles'];
}
