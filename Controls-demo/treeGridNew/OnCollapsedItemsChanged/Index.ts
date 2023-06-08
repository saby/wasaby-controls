import { Control, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-demo/treeGridNew/OnCollapsedItemsChanged/OnCollapsedItemsChanged';
import { HierarchicalMemory, CrudEntityKey } from 'Types/source';
import { IColumn } from 'Controls/grid';
import { SyntheticEvent } from 'Vdom/Vdom';
import { Events } from '../DemoHelpers/Data/Events';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';

function getData() {
    return Events.getDataExpandedItemsChanged();
}

export default class extends Control {
    protected _template: TemplateFunction = Template;
    protected _columns: IColumn[] = Events.getColumns();
    protected _expandedItems: CrudEntityKey[] = [null];
    protected _collapsedItems: CrudEntityKey[];

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

    static getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            listData: {
                dataFactoryName: 'Controls/dataFactory:List',
                dataFactoryArguments: {
                    displayProperty: 'title',
                    source: new HierarchicalMemory({
                        keyProperty: 'key',
                        data: getData(),
                        parentProperty: 'parent',
                        filter: (): boolean => {
                            return true;
                        },
                    }),
                    keyProperty: 'key',
                    parentProperty: 'parent',
                    nodeProperty: 'nodeType',
                    expandedItems: [null]
                },
            },
        };
    }
}
