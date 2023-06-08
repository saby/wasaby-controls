import { Control, TemplateFunction } from 'UI/Base';
import { SyntheticEvent } from 'Vdom/Vdom';
import { Logger } from 'UI/Utils';
import * as Template from 'wml!Controls-demo/treeGridNew/NodeFooter/NodeFooterTemplate/NodeFooterTemplate';
import { CrudEntityKey, HierarchicalMemory } from 'Types/source';
import { IColumn } from 'Controls/grid';
import { TreeGridNodeFooterRow } from 'Controls/treeGrid';

import { Flat } from 'Controls-demo/treeGridNew/DemoHelpers/Data/Flat';

export default class extends Control {
    protected _template: TemplateFunction = Template;
    protected _viewSource: HierarchicalMemory;
    protected _columns: IColumn[] = [
        {
            displayProperty: 'title',
        },
    ];
    protected _expandedItems: CrudEntityKey[] = [null];

    protected _beforeMount(): void {
        this._viewSource = new HierarchicalMemory({
            keyProperty: 'key',
            parentProperty: 'parent',
            data: Flat.getData(),
            filter: (): boolean => {
                return true;
            },
        });
    }

    protected _addButtonHandler(
        e: SyntheticEvent,
        item: TreeGridNodeFooterRow
    ): void {
        const nodeKey = item.getNode().getContents().getKey();
        Logger.info(`Adding started for node ${nodeKey}`);
    }
}
