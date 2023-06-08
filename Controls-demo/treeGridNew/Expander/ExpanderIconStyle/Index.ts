import { Control, TemplateFunction } from 'UI/Base';
import { CrudEntityKey, Memory } from 'Types/source';
import { IColumn } from 'Controls/grid';
import { Gadgets } from 'Controls-demo/treeGridNew/DemoHelpers/Data/Gadgets';

import * as Template from 'wml!Controls-demo/treeGridNew/Expander/ExpanderIconStyle/ExpanderIconStyle';

export default class extends Control {
    protected _template: TemplateFunction = Template;
    protected _viewSource: Memory;
    protected _columns: IColumn[] = [
        {
            displayProperty: 'title',
        },
    ];
    protected _expandedItems: CrudEntityKey[] = [null];

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
