import { Control, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-demo/treeGridNew/Expander/ExpanderSize/All/All';
import { CrudEntityKey, Memory } from 'Types/source';
import { IColumn } from 'Controls/grid';
import { Gadgets } from 'Controls-demo/treeGridNew/DemoHelpers/Data/Gadgets';

export default class extends Control {
    protected _template: TemplateFunction = Template;
    protected _viewSource: Memory;
    protected _columns: IColumn[] = [
        {
            displayProperty: 'title',
        },
    ];
    protected _expandedItems: CrudEntityKey[] = [null];
    protected _expandedItemsS: CrudEntityKey[] = [null];
    protected _expandedItemsM: CrudEntityKey[] = [null];
    protected _expandedItemsL: CrudEntityKey[] = [null];
    protected _expandedItemsXl: CrudEntityKey[] = [null];

    protected _beforeMount(): void {
        this._viewSource = new Memory({
            keyProperty: 'key',
            data: Gadgets.getData(),
            filter: () => {
                return true;
            },
        });
    }
}
