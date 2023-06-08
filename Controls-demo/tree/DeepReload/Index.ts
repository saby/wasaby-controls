import { Control, TemplateFunction } from 'UI/Base';
import { HierarchicalMemory, CrudEntityKey } from 'Types/source';
import { data } from 'Controls-demo/tree/data/Devices';
import { memoryFilter } from 'Controls-demo/treeGridNew/DemoHelpers/Filter/memoryFilter';

import * as Template from 'wml!Controls-demo/tree/DeepReload/DeepReload';

export default class extends Control {
    protected _template: TemplateFunction = Template;
    protected _viewSource: HierarchicalMemory;
    protected _expandedItems: CrudEntityKey[] = [];
    protected _collapsedItems: CrudEntityKey[] = [];

    private _getSource(): HierarchicalMemory {
        return new HierarchicalMemory({
            keyProperty: 'key',
            data,
            parentProperty: 'parent',
            filter: memoryFilter,
        });
    }

    protected _beforeMount(): void {
        this._viewSource = this._getSource();
    }

    /**
     * При deepReload=true смена source, filter, sorting, навигации, root
     * не сбросит раскрытые узлы при перезагрузке.
     * В этом методе подменяем source
     * @private
     */
    protected _changeSource(): void {
        this._viewSource = this._getSource();
    }

    static _styles: string[] = ['DemoStand/Controls-demo'];
}
