import { Control, TemplateFunction } from 'UI/Base';
import { HierarchicalMemory, CrudEntityKey } from 'Types/source';
import { SyntheticEvent } from 'Vdom/Vdom';
import { NodeState } from '../data/NodeState';

import * as Template from 'wml!Controls-demo/tree/OnCollapsedItemsChanged/OnCollapsedItemsChanged';

export default class extends Control {
    protected _template: TemplateFunction = Template;
    protected _viewSource: HierarchicalMemory;
    protected _expandedItems: CrudEntityKey[] = [null];
    protected _collapsedItems: CrudEntityKey[];

    protected _beforeMount(): void {
        this._viewSource = new HierarchicalMemory({
            keyProperty: 'key',
            data: NodeState.getDataCollapsedItemsChanged(),
            parentProperty: 'parent',
            filter: (): boolean => {
                return true;
            },
        });
    }

    protected _onCollapsedItemsChanged(
        event: SyntheticEvent,
        collapsedItems: CrudEntityKey[]
    ): void {
        const allowedToCollapseItemKeys: CrudEntityKey[] = [];
        collapsedItems.forEach((itemKey) => {
            if (itemKey === 1) {
                return;
            }
            allowedToCollapseItemKeys.push(itemKey);
        });
        this._collapsedItems = allowedToCollapseItemKeys;
    }

    static _styles: string[] = ['DemoStand/Controls-demo'];
}
