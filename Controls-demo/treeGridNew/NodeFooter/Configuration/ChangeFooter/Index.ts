import { Control, TemplateFunction } from 'UI/Base';
import { HierarchicalMemory, CrudEntityKey } from 'Types/source';
import { IColumn } from 'Controls/grid';
import { Flat } from 'Controls-demo/treeGridNew/DemoHelpers/Data/Flat';

import * as Template from 'wml!Controls-demo/treeGridNew/NodeFooter/Configuration/ChangeFooter/ChangeFooter';
import * as NodeFooter1 from 'wml!Controls-demo/treeGridNew/NodeFooter/Configuration/ChangeFooter/NodeFooter1';
import * as NodeFooter2 from 'wml!Controls-demo/treeGridNew/NodeFooter/Configuration/ChangeFooter/NodeFooter2';

export default class extends Control {
    protected _template: TemplateFunction = Template;
    protected _viewSource: HierarchicalMemory;
    protected _columns: IColumn[] = Flat.getColumns();
    protected _nodeFooterTemplate: TemplateFunction = NodeFooter1;
    protected _expandedItems: CrudEntityKey[] = [null];

    protected _beforeMount(): void {
        this._viewSource = new HierarchicalMemory({
            keyProperty: 'key',
            data: Flat.getData(),
            filter: () => {
                return true;
            },
        });
    }

    protected _changeNodeFooter(): void {
        this._nodeFooterTemplate =
            this._nodeFooterTemplate === NodeFooter1 ? NodeFooter2 : NodeFooter1;
    }
}
