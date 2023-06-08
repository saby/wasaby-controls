import { Control, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-demo/treeGridNew/OnExpandedItemsChanged/OnExpandedItemsChanged';
import { HierarchicalMemory, CrudEntityKey } from 'Types/source';
import { IColumn } from 'Controls/grid';
import { SyntheticEvent } from 'Vdom/Vdom';
import { Events } from '../DemoHelpers/Data/Events';

export default class extends Control {
    protected _template: TemplateFunction = Template;
    protected _viewSource: HierarchicalMemory;
    protected _columns: IColumn[] = Events.getColumns();
    protected _expandedItems: CrudEntityKey[] = [];
    protected _collapsedItems: CrudEntityKey[];

    protected _beforeMount(): void {
        this._viewSource = new HierarchicalMemory({
            keyProperty: 'key',
            data: Events.getDataExpandedItemsChanged(),
            parentProperty: 'parent',
            filter: (): boolean => {
                return true;
            },
        });
    }

    protected _onExpandedItemsChanged(
        event: SyntheticEvent,
        expandedItems: CrudEntityKey[]
    ): void {
        const allowedToExpandItemKeys: CrudEntityKey[] = [];
        expandedItems.forEach((itemKey) => {
            if (itemKey === 1) {
                return;
            }
            allowedToExpandItemKeys.push(itemKey);
        });
        this._expandedItems = allowedToExpandItemKeys;
    }
}
