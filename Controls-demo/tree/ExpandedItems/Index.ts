import { Control, TemplateFunction } from 'UI/Base';
import { CrudEntityKey, HierarchicalMemory } from 'Types/source';
import { data } from 'Controls-demo/tree/data/Devices';

import * as Template from 'wml!Controls-demo/tree/ExpandedItems/ExpandedItems';

export default class extends Control {
    protected _template: TemplateFunction = Template;
    protected _viewSource: HierarchicalMemory;
    protected _expandedItems: CrudEntityKey[] = [1];

    protected _beforeMount(): void {
        this._viewSource = new HierarchicalMemory({
            keyProperty: 'key',
            data,
            parentProperty: 'parent',
            filter: () => {
                return true;
            },
        });
    }

    static _styles: string[] = ['DemoStand/Controls-demo'];
}
